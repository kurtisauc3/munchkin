import 'Phaser';
import { socketIo } from '../utils';

class MainMenu extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenu' });
  }

  create() {
    socketIo.on('connect', () => console.log('[socket.io-client] Connected to server'));
  }
}

export { MainMenu };
