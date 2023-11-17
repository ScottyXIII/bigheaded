import * as Phaser from 'phaser';

type OptionsType = {
  width: number;
  height: number;
};

const matterAddImageEllipse = (
  scene: Phaser.Scene,
  x: number,
  y: number,
  key: string,
  frame: number | undefined,
  options: OptionsType,
) => {
  const { width, height } = options;
  const ellipse = scene.add.ellipse(0, 0, width, height);
  const points = ellipse.pathData.slice(0, -2).join(' ');
  ellipse.destroy();

  const imageGameObject = scene.add.image(x, y, key, frame);

  const ellipseGameObject = scene.matter.add.gameObject(imageGameObject, {
    shape: { type: 'fromVerts', verts: points, flagInternal: true },
    friction: 0.005,
    restitution: 1,
  });

  return ellipseGameObject as Phaser.Physics.Matter.Image;
};

export default matterAddImageEllipse;
