const { dialog } = require('@electron/remote');
const { spawn } = require('child_process');
const path = require('path');

let playerProcess = null;
let isPaused = false;

const playPauseBtn = document.getElementById('playPauseBtn');
const selectBtn = document.getElementById('selectBtn');
const stopBtn = document.getElementById('stopBtn');
const quitBtn = document.getElementById('quitBtn');
const volumeSlider = document.getElementById('volumeSlider');


function sendToPlayer(command) {
  if (playerProcess && playerProcess.stdin.writable) {
    playerProcess.stdin.write(command + '\n');
  }
}

function setTrackLabel(filepath) {
  if (!filepath) {
    updateTrackLabel('No music selected');
  } else {
    const songName = path.basename(filepath, path.extname(filepath));
    updateTrackLabel(songName);
  }
}

function updatePlayPauseButton() {
  if (!playerProcess || isPaused) {
    playPauseBtn.style.backgroundImage = "url('assets/pixelresume1.png')";
  } else {
    playPauseBtn.style.backgroundImage = "url('assets/pixelpause1.png')";
  }
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
      updatePlayPauseButton();
    } else if (msg.includes('RESUMED')) {
      isPaused = false;
      updatePlayPauseButton();
    } else if (msg.includes('STOPPED')) {
      isPaused = false;
      updatePlayPauseButton();
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
    updatePlayPauseButton();
    setTrackLabel(null);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updatePlayPauseButton();
  setTrackLabel(null);

  playPauseBtn.addEventListener('click', () => {
    if (!playerProcess) return;
    sendToPlayer(isPaused ? 'resume' : 'pause');
  });

  selectBtn.addEventListener('click', async () => {
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
    updatePlayPauseButton();
  });

  stopBtn.addEventListener('click', () => {
    if (!playerProcess) return;
    sendToPlayer('stop');
  });

  volumeSlider.addEventListener('change', () => {
    const volumeValue = parseInt(volumeSlider.value, 10);
    sendToPlayer(`volume ${volumeValue}`);
  });


  quitBtn.addEventListener('click', () => {
    window.close();
  });

  window.addEventListener('beforeunload', () => {
    if (playerProcess) {
      sendToPlayer('stop');
      playerProcess.kill();
      playerProcess = null;
    }
  });
});

function updateTrackLabel(text) {
  const trackLabel = document.getElementById('trackLabel');
  const scrollingText = trackLabel.querySelector('.scrolling-text');

  scrollingText.textContent = text;
  scrollingText.style.animation = 'none';

  const containerWidth = trackLabel.clientWidth;
  const textWidth = scrollingText.scrollWidth;

  const totalDistance = containerWidth + textWidth;

  const speed = 60; 

  const duration = totalDistance / speed;
  scrollingText.style.animation = `scroll-left ${duration}s linear infinite`;
}