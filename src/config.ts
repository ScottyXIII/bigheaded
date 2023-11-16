import * as Phaser from 'phaser';
import GameScene from '@/scenes/game-scene';

// 16:9 horizontal sizes
// - 360p = 640✕360
// - 480p = 854✕480
// - 720p = 1280×720
// - 1080p = 1920✕1080

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  width: 1280,
  height: 720,
  canvas: document.getElementById('game') as HTMLCanvasElement,
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
