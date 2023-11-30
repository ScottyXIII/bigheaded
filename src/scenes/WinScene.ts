import Text from '@/objects/Text';
import UIElement from '@/objects/UIElement';
import googleFont, { FontFamilyEnum } from '@/helpers/googleFont';
import noNew from '@/helpers/noNew';
import Audio from '@/objects/Audio';

const soundConfig = [
  {
    key: 'congratulations',
    filePath: './audio/sfx/congratulations.mp3',
    loop: false,
  },
];

class WinScene extends Phaser.Scene {
  public static preload(scene: Phaser.Scene) {
    UIElement.preload(scene);
    Audio.preload(scene, soundConfig);
  }

  constructor() {
    super('win-scene');
  }

  preload() {
    WinScene.preload(this);
  }

  create() {
    const audio = new Audio(this, soundConfig);
    audio.playAudio('congratulations');

    const { width, height } = this.sys.game.canvas;
    const cx = width / 2;
    const cy = height / 2;

    googleFont(this, cx, cy - 100, {
      fontFamily: FontFamilyEnum.BAGEL,
      text: 'You Win!',
      color: '#FFF',
      fontSize: 128,
      origin: 0.5,
    });

    const message = new Text(this, cx, cy - 20);
    message.textbox.setOrigin(0.5, 0.5);
    message.textbox.text = 'Congratulations!';

    noNew(UIElement, this, cx, cy + 100, {
      content: 'Continue',
      width: 300,
      onClick: () => this.scene.start('main-menu-scene'),
    });
  }
}

export default WinScene;
