import * as Phaser from 'phaser';
import Text from '@/objects/Text';
import Button from '@/objects/Button';
import GameScene from '@/scenes/game-scene';
import BagelFatOneFont from '@/objects/BagelFatOneFont';
import MaterialUIIconFont, { IconNames } from '@/objects/MaterialUIIconFont';
import googleFont from '@/helpers/googleFont';
import { Fonts } from '@/helpers/webFontLoader';

class PreloaderScene extends Phaser.Scene {
  constructor() {
    super('preloader-scene');
  }

  preload() {
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
    const btn = new Button(this, cx, cy + 100, 'CONTINUE', 300);

    const menu = new MaterialUIIconFont(this, width - 64, 64, {
      text: IconNames.SETTINGS,
      origin: 0.5,
      fontSize: 32,
    });

    const text1 = googleFont(this, 10, 10, {
      fontFamily: Fonts.BAGEL,
      text: 'hello',
      // icon: IconNames.FULLSCREEN,
      color: '#777',
      fontSize: 64,
      lineSpacing: -30,
      // origin: 0.5,
    });

    // eslint-disable-next-line no-console
    console.log(BF, btn, menu, text1);
  }
}

export default PreloaderScene;
