import * as Phaser from 'phaser';

const parallax = (
  scene: Phaser.Scene,
  assetName = 'background',
  path = '/level/parallax/forest2022',
  imgCount = 8,
) => {
  const images = Array.from({ length: imgCount }, (_, index) => {
    const indexPlus = index + 1;
    return {
      index: indexPlus,
      name: `${assetName}${indexPlus}`,
      imagePath: `${path}/${indexPlus}.png`,
    };
  });
  const { width, height } = scene.scale;

  const preLoad = () => {
    images.forEach(({ name, imagePath }) => scene.load.image(name, imagePath));
  };

  const create = () => {
    images.forEach(({ index, name }) => {
      const scrollFactorX = 0.01 + index / 20;
      const scrollFactorY = 0.01 + index / 50;
      scene.add
        .image(width, height, name)
        .setOrigin(0, 0)
        .setScrollFactor(scrollFactorX, scrollFactorY)
        .setPosition(0, 0)
        .setSize(width, height);
    });
  };

  return { preLoad, create };
};

export default parallax;
