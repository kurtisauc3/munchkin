import * as Electron from 'electron';

type ClientElectron = Pick<
  typeof Electron,
  | 'clipboard'
  | 'contextBridge'
  | 'crashReporter'
  | 'desktopCapturer'
  | 'ipcRenderer'
  | 'nativeImage'
  | 'shell'
  | 'webFrame'
>;

const electron = window.require('electron') as ClientElectron;

export { electron };
