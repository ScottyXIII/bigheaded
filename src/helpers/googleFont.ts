import * as Phaser from 'phaser';

const src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js';

export enum FontFamilyEnum {
  BAGEL = 'Bagel Fat One',
  ICONS = 'Material Icons',
}

export const webFontLoader = () => {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.onload = () => {
    // @ts-expect-error window.WebFont is defined after webfont.js is loaded (at this point)
    window.WebFont.load({
      google: {
        families: Object.values(FontFamilyEnum),
      },
      active: () => {
        // eslint-disable-next-line no-console
        console.log('all google webfonts loaded!');
      },
    });
  };
  script.src = src;
  document.getElementsByTagName('head')[0].appendChild(script);
};

// choose new icons here https://fonts.google.com/icons?icon.set=Material+Icons
export enum IconEnum {
  SETTINGS = '\ue8b8',
  CLOSE = '\ue5cd',
  REFRESH = '\ue5d5',
  SFXON = '\ue050',
  SFXOFF = '\ue04f',
  MUSICON = '\ue405',
  MUSICOFF = '\ue440',
  FULLSCREENON = '\ue5d1',
  FULLSCREENOFF = '\ue5d0',
  EYEOPEN = '\ue8f4',
  EYECLOSED = '\ue8f5',
  SCENES = '\ue413',
  TOUCHSWIPE = '\ue9ec',
  TOUCHTAP = '\ue913',
  HORIZONTALARROWS = '\uea18',
}

const googleFont = (
  scene: Phaser.Scene,
  x: number,
  y: number,
  {
    fontFamily,
    text,
    icon,
    origin = undefined,
    ...options
  }: {
    fontFamily: FontFamilyEnum;
    text?: string;
    icon?: IconEnum;
    origin?: number;
  } & Phaser.Types.GameObjects.Text.TextStyle,
) => {
  const content = icon || text || '';
  const textObj = scene.add
    .text(x, y, content, {
      fontFamily,
      ...options,
    })
    .setShadow(2, 2, '#000000', 2, false, true)
    .setScrollFactor(0)
    .setDepth(1000);

  if (origin) textObj.setOrigin(origin);
  return textObj;
};

export default googleFont;
