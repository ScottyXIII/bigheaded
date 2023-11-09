import { WEBGL } from 'phaser';

import GameScene from '@/scenes/game-scene';

const canvas = document.getElementById('game') as HTMLCanvasElement;

const config = {
  type: WEBGL,
  width: window.innerWidth,
  height: window.innerHeight,
  canvas,
  physics: {
    default: 'matter', // 'arcade',
    // arcade: {
    //   gravity: { x: 0, y: 1 },
    //   checkCollision: {
    //     left: true,
    //     right: true,
    //     up: true,
    //     down: true,
    //   },
    //   debug: true,
    // },
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
  scene: [GameScene],
};

export default config;
