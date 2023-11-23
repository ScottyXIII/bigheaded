import * as Phaser from 'phaser';

import Text from '@/objects/Text';
import GameScene from './game-scene';

class PreloaderScene extends Phaser.Scene {
  constructor() {
    super('preloader-scene');
  }

  preload() {
    // @ts-expect-error nope
    window.killSpinner();

    const message = new Text(this, 10, 10);
    const message2 = new Text(this, 10, 50);

    message.textbox.text = 'LOADING...';

    this.load.on('progress', (value: number) => {
      const percent = String(Math.round(value * 100)).padStart(3, '0');
      message.textbox.text = `${percent}%`;
    });

    this.load.on('fileprogress', (file: { src: string }) => {
      const parts = file.src.split('/');
      message2.textbox.text = parts[parts.length - 1];
    });

    this.load.on('complete', () => {
      message.textbox.text = 'Click, Tap, or Spacebar to continue';
      message2.textbox.text = '';

      const next = () => this.scene.start('game-scene');

      // keyboard controls
      const spaceKey = this.input.keyboard?.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE,
      );
      spaceKey?.on('down', next);

      // touch tap mobile and mouse leftclick controls
      this.input.on('pointerdown', next);
    });

    GameScene.preloadExternal(this);
  }

  // update() {
  //   if (!message) return;
  // }
}

export default PreloaderScene;
