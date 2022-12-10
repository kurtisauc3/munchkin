import * as Electron from 'electron';
interface GoogleProfile {
  aud: string;
  email: string;
  email_verified: boolean;
  exp: number;
  family_name: string;
  given_name: string;
  iat: number;
  iss: string;
  locale: string;
  name: string;
  nickname: string;
  picture: string;
  sub: string;
  updated_at: string;
}
interface EmailProfile {
  aud: string;
  email: string;
  email_verified: boolean;
  exp: number;
  iat: number;
  iss: string;
  name: string;
  nickname: string;
  picture: string;
  sub: string;
  updated_at: string;
}
interface UserData {
  accessToken: string;
  profile: GoogleProfile | EmailProfile;
}
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
const userData = electron.ipcRenderer.sendSync('userData') as UserData;

export { electron, userData };
