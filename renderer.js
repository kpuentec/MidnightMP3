const { dialog } = require('@electron/remote');
const { exec, execFile, spawn } = require('child_process');

let playerProcess = null;

document.addEventListener('DOMContentLoaded', () => {
  const playBtn = document.getElementById('playBtn');

  playBtn.addEventListener('click', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      filters: [{ name: 'Audio Files', extensions: ['mp3'] }],
      properties: ['openFile']
    });

    if (canceled || filePaths.length === 0) {
      alert('No file selected');
      return;
    }

    const filePath = filePaths[0];
    console.log('Selected file:', filePath);

    if (playerProcess) {
      playerProcess.kill();
      playerProcess = null;
    }

    playerProcess = spawn('python', ['player.py', filePath]);

    playerProcess.stdout.on('data', (data) => {
      console.log(`Python stdout: ${data}`);
    });

    playerProcess.stderr.on('data', (data) => {
      console.error(`Python stderr: ${data}`);
    });

    playerProcess.on('close', (code) => {
      console.log(`Python process exited with code ${code}`);
      playerProcess = null;
    });
  });

  window.addEventListener('beforeunload', () => {
    if (playerProcess) {
      playerProcess.kill();
      playerProcess = null;
    }
  });
});
