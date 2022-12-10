require('dotenv').config();
import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import { AuthService } from './auth-service';

type BrowserWindowOrNull = BrowserWindow | null;
type WindowType = 'app' | 'auth' | 'logout';

let authService = new AuthService();

const { SERVER_URL, REDIRECT_URL, GAME_WIDTH, GAME_HEIGHT } = process.env;

let appWindow: BrowserWindowOrNull = null;
let authWindow: BrowserWindowOrNull = null;
let logoutWindow: BrowserWindowOrNull = null;
// let isConfirmed = false;

function closeAuthWindow() {
  return new Promise<void>((res) => {
    if (authWindow !== null) {
      authWindow.on('closed', () => {
        authWindow = null;
        res();
      });
      authWindow.close();
    } else {
      res();
    }
  });
}

function closeAppWindow() {
  return new Promise<void>((res) => {
    if (appWindow !== null) {
      // isConfirmed = true;
      appWindow.on('closed', () => {
        appWindow = null;
        // isConfirmed = false;
        res();
      });
      appWindow.close();
    } else {
      res();
    }
  });
}

function closeLogoutWindow() {
  return new Promise<void>((res) => {
    if (logoutWindow !== null) {
      logoutWindow.on('closed', () => {
        logoutWindow = null;
        res();
      });
      logoutWindow.close();
    } else {
      res();
    }
  });
}

async function cleanupWindows(caller: WindowType) {
  caller !== 'app' && (await closeAppWindow());
  caller !== 'auth' && (await closeAuthWindow());
  caller !== 'logout' && (await closeLogoutWindow());
}

async function createWindow() {
  try {
    await authService.refreshTokens();
    createAppWindow();
  } catch (err) {
    createAuthWindow();
  }
}

async function createAppWindow() {
  await cleanupWindows('app');
  if (appWindow !== null) return;

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
      appWindow?.webContents.openDevTools();
      appWindow?.focus();
    }
  });
  appWindow.on('close', (e) => {
    // if (!isConfirmed) {
    //   e.preventDefault();
    //   appWindow?.webContents.send('try-exit');
    // }
  });
}

async function createAuthWindow() {
  await cleanupWindows('auth');
  if (authWindow !== null) return;
  authWindow = new BrowserWindow({
    width: 960,
    height: 720,
    resizable: false,
    webPreferences: {
      nodeIntegration: false
    }
  });
  authWindow.on('show', () => {
    if (isDev) {
      authWindow?.webContents.openDevTools();
      authWindow?.focus();
    }
  });
  authWindow.loadURL(authService.authenticationUrl, { userAgent: 'Chrome' });
  const { webRequest } = authWindow.webContents.session;
  webRequest.onBeforeRequest({ urls: [`${REDIRECT_URL}*`] }, async ({ url }) => {
    await authService.loadTokens(url);
    createAppWindow();
  });
}

async function createLogoutWindow() {
  await cleanupWindows('logout');
  if (logoutWindow !== null) return;
  logoutWindow = new BrowserWindow({ show: false });
  logoutWindow.loadURL(authService.logoutUrl);
  logoutWindow.on('ready-to-show', async () => {
    await authService.logout();
    createAuthWindow();
  });
}

app.on('ready', () => {
  createWindow();
});
app.on('window-all-closed', () => {
  app.quit();
});

ipcMain.on('confirm-exit', () => {
  closeAppWindow();
});
ipcMain.on('confirm-logout', (event, args) => {
  createLogoutWindow();
});
ipcMain.on('userData', (event, args) => {
  const { accessToken, profile } = authService;
  event.returnValue = {
    accessToken,
    profile
  };
});
ipcMain.on('serverURL', (event, args) => {
  event.returnValue = SERVER_URL;
});
