import * as Phaser from 'phaser';
import PreloaderScene from '@/scenes/preloader-scene';
import GameScene from '@/scenes/game-scene';
import isDev from '@/helpers/isDev';
import DeathScene from './scenes/death-scene';

// 16:9 horizontal sizes
// - 360p = 640✕360
// - 480p = 854✕480
// - 720p = 1280×720
// - 1080p = 1920✕1080

const debug = {
  showBody: true,
  showStaticBody: true,
};

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
        y: 2,
      },
      ...(isDev && { debug }),
    },
  },
  fps: {
    forceSetTimeOut: true, // force matter js engine speed to be consistent across devices
  },
  scene: [PreloaderScene, GameScene, DeathScene],
  input: { activePointers: 2 }, // setup multitouch for mobile
};

export default config;
