import * as Phaser from 'phaser';
import GameScene from '@/scenes/game-scene';

const canvas = document.getElementById('game') as HTMLCanvasElement;
const gameWidth = 16 * 50;
const gameheight = 9 * 50;

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  width: gameWidth,
  height: gameheight,
  canvas,
  physics: {
    default: 'matter',
    matter: {
      enableSleeping: true,
      gravity: {
        y: 1,
      },
      debug: {
        showBody: true,
        showStaticBody: true,
      },
    },
  },
  scene: [GameScene],
};

export default config;
