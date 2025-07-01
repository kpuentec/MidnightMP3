const { app, BrowserWindow } = require('electron');
const remoteMain = require('@electron/remote/main');

remoteMain.initialize();

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 500,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  remoteMain.enable(win.webContents);

  win.loadFile('index.html');
  win.webContents.openDevTools(); // optional: open devtools on launch
}

app.whenReady().then(createWindow);
