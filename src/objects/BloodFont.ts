import * as Phaser from 'phaser';

class BloodFont {
  private text: Phaser.GameObjects.Text | undefined;

  static preload(scene: Phaser.Scene) {
    scene.load.script(
      'webfont',
      'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js',
    );
  }

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    { text, origin = undefined, ...options }: { text: string; origin?: number },
  ) {
    // @ts-expect-error window.webFont is defined above
    window.WebFont.load({
      google: {
        families: ['Bagel Fat One'],
      },
      active: () => {
        this.text = scene.add
          .text(x, y, text, {
            fontFamily: 'Bagel Fat One',
            fontSize: 64,
            lineSpacing: -30,
            color: '#FFF',
            ...options,
          })
          .setShadow(2, 2, '#000000', 2, false, true)
          .setScrollFactor(0)
          .setDepth(1000);

        if (origin) this.text.setOrigin(origin);
      },
    });
  }
}

export default BloodFont;
