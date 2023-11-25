import * as Phaser from 'phaser';

type ButtonOptionsType = {
  content: string;
  width: number;
  onClick: () => void;
};

class Button extends Phaser.GameObjects.Container {
  public button: Phaser.GameObjects.NineSlice;

  static preload(scene: Phaser.Scene) {
    scene.load.atlas(
      'ui',
      'https://labs.phaser.io/assets/ui/nine-slice.png',
      'https://labs.phaser.io/assets/ui/nine-slice.json',
    );
  }

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    options: ButtonOptionsType,
  ) {
    super(scene, x, y);

    this.scene = scene;

    const { content, width, onClick } = options;

    this.button = scene.add.nineslice(
      x,
      y,
      'ui',
      'button-bg',
      128,
      110,
      64,
      64,
    );

    const text = scene.add.text(x, y, content, {
      font: '25px Arial',
      align: 'center',
    });
    text.setOrigin(0.5, 0.5);
    text.setWordWrapWidth(width - 100);

    this.button.width = width;
    this.button.setInteractive({ useHandCursor: true });
    const hitboxPositionFix = (width - 128) / 2;
    this.button.input?.hitArea.setPosition(-hitboxPositionFix, 0);
    this.button.on('pointerdown', onClick);

    scene.tweens.add({
      targets: [this.button],
      width: width + 20,
      duration: 300,
      ease: 'sine.inout',
      yoyo: true,
      repeat: -1,
    });
  }
}

export default Button;
