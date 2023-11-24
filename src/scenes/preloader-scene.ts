import * as Phaser from 'phaser';
import Text from '@/objects/Text';
import Button from '@/objects/Button';
import GameScene from '@/scenes/game-scene';
import BagelFatOneFont from '@/objects/BagelFatOneFont';

class PreloaderScene extends Phaser.Scene {
  constructor() {
    super('preloader-scene');
  }

  preload() {
    BagelFatOneFont.preload(this);
    Button.preload(this);

    const { width, height } = this.sys.game.canvas;
    const cx = width / 2;
    const cy = height / 2;
    const message1 = new Text(this, cx, cy - 20);
    const message2 = new Text(this, cx, cy + 20);

    message1.textbox.setOrigin(0.5, 0.5);
    message2.textbox.setOrigin(0.5, 0.5);

    message1.textbox.text = '0%';
    message2.textbox.text = 'LOADING...';

    this.load.on('progress', (value: number) => {
      const percent = Math.floor(value * 100);
      message1.textbox.text = `${percent}%`;
    });

    this.load.on('fileprogress', (file: { src: string }) => {
      const parts = file.src.split('/');
      message2.textbox.text = parts[parts.length - 1];
    });

    this.load.on('complete', () => {
      message1.textbox.text = '';
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

  create() {
    const { width, height } = this.sys.game.canvas;
    const cx = width / 2;
    const cy = height / 2;
    const BF = new BagelFatOneFont(this, cx, cy - 100, {
      text: 'BigHeaded',
      origin: 0.5,
      fontSize: 128,
    });
    const btn = new Button(this, cx, cy + 150, 'CONTINUE', 300);

    // eslint-disable-next-line no-console
    console.log(BF, btn);
  }
}

export default PreloaderScene;
