import * as Phaser from 'phaser';
import { PhaserMatterImage } from '@/types';

type AdditionalOptionsType = {
  width: number;
  height: number;
};

const matterAddImageEllipse = (
  scene: Phaser.Scene,
  x: number,
  y: number,
  key: string,
  frame: number | undefined,
  options: Phaser.Types.Physics.Matter.MatterBodyConfig & AdditionalOptionsType,
) => {
  const { width, height, ...other } = options;
  const ellipse = scene.add.ellipse(0, 0, width, height);
  const points = ellipse.pathData.slice(0, -2).join(' ');
  ellipse.destroy();

  const imageGameObject = scene.add.image(x, y, key, frame);

  const ellipseGameObject = scene.matter.add.gameObject(imageGameObject, {
    shape: { type: 'fromVerts', verts: points, flagInternal: true },
    ...other,
  });

  return ellipseGameObject as PhaserMatterImage;
};

export default matterAddImageEllipse;
