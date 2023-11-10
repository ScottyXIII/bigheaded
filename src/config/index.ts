import { WEBGL } from 'phaser';

import GameScene from '@/scenes/game-scene';
import TrainingZone from '@/scenes/training-zone';

const canvas = document.getElementById('game') as HTMLCanvasElement;

const config = {
  type: WEBGL,
  width: window.innerWidth,
  height: window.innerHeight,
  canvas,
  physics: {
    default: 'matter',
    matter: {
      enableSleeping: true,
      gravity: {
        y: 1,
      },
      plugins: {
        attractors: true,
      },
      debug: {
        showBody: true,
        showStaticBody: true,
      },
    },
  },
  scene: [GameScene, TrainingZone],
};

export default config;
