import * as Phaser from 'phaser';
import isDev from '@/helpers/isDev';
import PreloaderScene from '@/scenes/PreloaderScene';
import MainMenuScene from '@/scenes/MainMenuScene';
import ShopScene from '@/scenes/ShopScene';
import GameScene from '@/scenes/GameScene';
import Level2 from '@/scenes/Level2';
import Level3 from '@/scenes/level3';
import DeathScene from '@/scenes/DeathScene';
import WinScene from '@/scenes/WinScene';
import SceneSelectorScene from '@/scenes/SceneSelectorScene';
import UIDemoScene from '@/scenes/UIDemoScene';

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
  scene: [
    PreloaderScene,
    MainMenuScene,
    ShopScene,
    GameScene,
    Level2,
    Level3,
    DeathScene,
    WinScene,
    SceneSelectorScene,
    UIDemoScene,
  ],
  input: { activePointers: 3 }, // setup 1 mouse + 2 multitouch points for mobile
};

export default config;
