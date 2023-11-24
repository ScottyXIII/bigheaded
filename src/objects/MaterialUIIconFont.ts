import * as Phaser from 'phaser';

export enum IconNames {
  SETTINGS = 'SETTINGS',
  FULLSCREEN = 'FULLSCREEN',
  SOUNDON = 'SOUNDON',
  SOUNDOFF = 'SOUNDOFF',
}

const icons = {
  SETTINGS: '\ue8b8',
  FULLSCREEN: '\ue5d0',
  SOUNDON: '\ue050',
  SOUNDOFF: '\ue04f',
};

class MaterialUIIconFont {
  private text: Phaser.GameObjects.Text | undefined;

  // static preload(scene: Phaser.Scene) {
  // scene.load.script(
  //   'webfont',
  //   'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js',
  // );
  // window.addEventListener('load', () => {
  //   // @ts-expect-error window.webFont is defined above
  //   window.WebFont.load({
  //     google: {
  //       families: ['Material Icons'],
  //     },
  //     active: () => {
  //       alert('loaded');
  //     },
  //   });
  // });
  // }

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    {
      text,
      origin = undefined,
      ...options
    }: {
      text: IconNames;
      origin?: number;
    } & Phaser.Types.GameObjects.Text.TextStyle,
  ) {
    // window.WebFont.load({
    //   google: {
    //     families: ['Material Icons'],
    //   },
    //   active: () => {
    //     alert('loaded1');
    //   },
    // });
    // window.WebFont.load({
    //   google: {
    //     families: ['Material Icons'],
    //   },
    //   active: () => {
    //     alert('loaded2');
    //   },
    // });

    // window.WebFont.load({
    //   google: {
    //     families: ['Material Icons'],
    //   },
    //   active: () => {
    this.text = scene.add
      .text(x, y, icons[text], {
        fontFamily: 'Material Icons',
        fontSize: 64,
        lineSpacing: -30,
        color: '#777',
        ...options,
      })
      .setShadow(2, 2, '#000000', 2, false, true)
      .setScrollFactor(0)
      .setDepth(1000);

    if (origin) this.text.setOrigin(origin);
    // },
    // });
  }
}

export default MaterialUIIconFont;
