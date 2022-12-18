require('dotenv').config();
import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';

const { GAME_WIDTH, GAME_HEIGHT } = process.env;

let appWindow: BrowserWindow;

function createWindow() {
  appWindow = new BrowserWindow({
    width: parseInt(GAME_WIDTH),
    height: parseInt(GAME_HEIGHT),
    useContentSize: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  appWindow.loadURL(`file://${path.join(__dirname, './index.html')}`);
  appWindow.on('show', () => {
    if (isDev) {
      appWindow.webContents.openDevTools();
      appWindow.focus();
    }
  });
  appWindow.on('closed', () => {
    appWindow = null;
  });
}

app.on('ready', () => {
  createWindow();
});
app.on('window-all-closed', () => {
  app.quit();
});
