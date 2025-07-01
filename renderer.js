const { dialog } = require('@electron/remote');
const { spawn } = require('child_process');
const path = require('path');


let playerProcess = null;
let isPaused = false;

const trackLabel = document.getElementById('trackLabel');
const playBtn = document.getElementById('playBtn');
const pauseToggleBtn = document.getElementById('pauseToggleBtn');
const stopBtn = document.getElementById('stopBtn');
const quitBtn = document.getElementById('quitBtn');


function sendToPlayer(command) {
  if (playerProcess && playerProcess.stdin.writable) {
    playerProcess.stdin.write(command + '\n');
  }
}

function setTrackLabel(filepath) {
  if (!filepath) {
    trackLabel.textContent = 'No music selected';
  } else {
    trackLabel.textContent = path.basename(filepath, path.extname(filepath));
  }
}

function updatePauseButtonText() {
  pauseToggleBtn.textContent = isPaused ? 'Resume' : 'Pause';
}

function initPlayerProcess() {
  if (playerProcess) return;

  playerProcess = spawn('python', ['player.py'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
  });

  playerProcess.stdout.on('data', (data) => {
    const msg = data.toString().trim();
    console.log(`PYTHON: ${msg}`);

    if (msg.includes('PAUSED')) {
      isPaused = true;
      updatePauseButtonText();
    } else if (msg.includes('RESUMED')) {
      isPaused = false;
      updatePauseButtonText();
    } else if (msg.includes('STOPPED')) {
      isPaused = false;
      updatePauseButtonText();
      setTrackLabel(null);
    }
  });

  playerProcess.stderr.on('data', (data) => {
    console.error(`PYTHON ERROR: ${data.toString()}`);
  });

  playerProcess.on('close', () => {
    console.log("Player process closed");
    playerProcess = null;
    isPaused = false;
    updatePauseButtonText();
    setTrackLabel(null);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updatePauseButtonText();
  setTrackLabel(null);

  playBtn.addEventListener('click', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      filters: [{ name: 'Audio Files', extensions: ['mp3'] }],
      properties: ['openFile']
    });

    if (canceled || filePaths.length === 0) return;

    const filePath = filePaths[0];
    const safeFilePath = filePath.replace(/\\/g, '\\\\');

    initPlayerProcess();
    sendToPlayer(`load ${safeFilePath}`);
    setTrackLabel(filePath);
    isPaused = false;
    updatePauseButtonText();
  });

  pauseToggleBtn.addEventListener('click', () => {
    if (!playerProcess) return;
    sendToPlayer(isPaused ? 'resume' : 'pause');
  });

  stopBtn.addEventListener('click', () => {
    if (!playerProcess) return;
    sendToPlayer('stop');
  });

  window.addEventListener('beforeunload', () => {
    if (playerProcess) {
      sendToPlayer('stop');
      playerProcess.kill();
      playerProcess = null;
    }
  });

  quitBtn.addEventListener('click', () => {
    window.close();
  });

});
