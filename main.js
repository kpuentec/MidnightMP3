const { app, BrowserWindow, Menu } = require('electron');
const remoteMain = require('@electron/remote/main');

remoteMain.initialize();

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 500,
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  Menu.setApplicationMenu(null);
  remoteMain.enable(win.webContents);

  win.loadFile('index.html');
  // win.webContents.openDevTools(); // dev tools

  win.setMaximizable(false);


}

app.whenReady().then(createWindow);
