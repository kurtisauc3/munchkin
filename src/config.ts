import { MainScene } from './scenes/main-scene';

export const GameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Munchkin',
  width: 800,
  height: 600,
  type: Phaser.AUTO,
  parent: 'game',
  scene: [MainScene]
};
