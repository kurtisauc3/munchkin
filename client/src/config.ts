import { MainMenu } from './scenes';

const { GAME_WIDTH, GAME_HEIGHT } = process.env;

export const GameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Munchkin',
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'game',
    width: parseInt(GAME_WIDTH),
    height: parseInt(GAME_HEIGHT)
  },
  scene: [MainMenu] // TODO add more scenes here
};
