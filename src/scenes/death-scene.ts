import Text from '@/objects/Text';
import Button from '@/objects/Button';
import googleFont, { FontFamilyEnum } from '@/helpers/googleFont';

class DeathScene extends Phaser.Scene {
  // @ts-expect-error lesser of all the evils
  private btn: Button | undefined;

  public static preload(scene: Phaser.Scene) {
    Button.preload(scene);
  }

  constructor() {
    super('death-scene');
  }

  preload() {
    DeathScene.preload(this);
  }

  create() {
    const { width, height } = this.sys.game.canvas;
    const cx = width / 2;
    const cy = height / 2;

    googleFont(this, cx, cy - 100, {
      fontFamily: FontFamilyEnum.BAGEL,
      text: 'You Died',
      color: '#FFF',
      fontSize: 128,
      origin: 0.5,
    });

    const message = new Text(this, cx, cy - 20);
    message.textbox.setOrigin(0.5, 0.5);
    message.textbox.text = 'Oh no! Ben fell over. Try to keep him upright!';

    this.btn = new Button(this, cx, cy + 100, {
      content: 'Restart',
      width: 300,
      onClick: () => this.scene.start('main-menu-scene'),
    });
  }
}

export default DeathScene;
