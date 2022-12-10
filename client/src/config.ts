import { MainScene } from './scenes/main-scene';
import { ServerPlugin } from './plugins';

const { GAME_WIDTH, GAME_HEIGHT } = process.env;

export const GameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Munchkin',
  width: parseInt(GAME_WIDTH),
  height: parseInt(GAME_HEIGHT),
  type: Phaser.AUTO,
  parent: 'game',
  scene: [MainScene],
  plugins: {
    global: [
      {
        plugin: ServerPlugin,
        key: 'server-plugin',
        start: true
      }
    ]
  }
};
