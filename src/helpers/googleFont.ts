import * as Phaser from 'phaser';
import { FontFamilyEnum } from './webFontLoader';

export enum IconEnum {
  SETTINGS = '\ue8b8',
  FULLSCREEN = '\ue5d0',
  SOUNDON = '\ue050',
  SOUNDOFF = '\ue04f',
  REFRESH = '\ue5d5',
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
