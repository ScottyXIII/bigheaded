import * as Phaser from 'phaser';
import Text from '@/objects/Text';
import Button from '@/objects/Button';
import GameScene from '@/scenes/game-scene';
import googleFont, { IconEnum } from '@/helpers/googleFont';
import { FontFamilyEnum } from '@/helpers/webFontLoader';
import isDev from '@/helpers/isDev';

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

    const btn = new Button(this, cx, cy + 100, {
      content: 'CONTINUE',
      width: 300,
      onClick: () => this.scene.start('game-scene'),
    });

    const text1 = googleFont(this, cx, cy - 100, {
      fontFamily: FontFamilyEnum.BAGEL,
      text: 'BigHeaded',
      color: '#FFF',
      fontSize: 128,
      origin: 0.5,
    });

    const text2 = googleFont(this, width - 32, 32, {
      fontFamily: FontFamilyEnum.ICONS,
      icon: IconEnum.SETTINGS,
      color: '#ffffff44',
      fontSize: 24,
      origin: 0.5,
      padding: {
        top: 20, // fix chrome cutoff icons, it does not affect position
        left: 20,
        right: 20,
        bottom: 10,
      },
    });
    text2.setInteractive({ useHandCursor: true });
    text2.on('pointerdown', () => alert('settings button'));

    this.scale.updateBounds(); // fix bad hitbox positions

    if (isDev) {
      this.input.enableDebug(text2);
      this.input.enableDebug(btn.button);
    }

    // eslint-disable-next-line no-console
    console.log({ btn, text1, text2 });
  }
}

export default PreloaderScene;
