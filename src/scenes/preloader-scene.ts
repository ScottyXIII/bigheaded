import * as Phaser from 'phaser';

import Text from '@/objects/Text';
import GameScene from './game-scene';

class PreloaderScene extends Phaser.Scene {
  constructor() {
    super('preloader-scene');
  }

  preload() {
    const message = new Text(this, 10, 10);
    const message2 = new Text(this, 10, 50);
    const message3 = new Text(this, 10, 90);

    message.textbox.text = 'LOADING...';
    message2.textbox.text = '';
    message3.textbox.text = '';

    this.load.on('progress', (value: number) => {
      const percent = String(Math.floor(value * 100)).padStart(3, '0');
      message.textbox.text = `${percent}%`;
    });

    this.load.on('fileprogress', (file: { src: string }) => {
      const parts = file.src.split('/');
      message2.textbox.text = parts[parts.length - 1];
    });

    this.load.on('complete', () => {
      message.textbox.text = '';
      message2.textbox.text = '';
      message3.textbox.text = 'Click, Tap, or Spacebar to continue';

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
}

export default PreloaderScene;
