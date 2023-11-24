import * as Phaser from 'phaser';

type ButtonOptionsType = {
  content: string;
  width: number;
};

class Button extends Phaser.GameObjects.Container {
  public ball: Phaser.GameObjects.Image | undefined;

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

    const { content, width } = options;

    const button1 = scene.add.nineslice(
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

    button1.width = width;
    button1.setInteractive();
    // button1.on('pointerdown', ({ event }) => {
    //   event.stopImmediatePropagation();
    //   event.stopPropagation();
    //   console.log('pointerdown');
    // });

    scene.tweens.add({
      targets: [button1],
      width: width + 20,
      duration: 300,
      ease: 'sine.inout',
      yoyo: true,
      repeat: -1,
    });
  }
}

export default Button;
