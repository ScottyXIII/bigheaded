import * as Phaser from 'phaser';

const parallaxPath = './level/parallax';

const parallax = (
  scene: Phaser.Scene,
  assetName = 'forest2022',
  imgCount = 8,
) => {
  const images = Array.from({ length: imgCount }, (_, index) => {
    const indexPlus = index + 1;
    return {
      index: indexPlus,
      name: `${assetName}${indexPlus}`,
      imagePath: `${parallaxPath}/${assetName}/${indexPlus}.png`,
    };
  });
  const { width, height } = scene.scale;

  const preLoad = () => {
    images.forEach(({ name, imagePath }) => scene.load.image(name, imagePath));
  };

  let bgs;

  const create = () => {
    bgs = images.map(({ name }) =>
      scene.add
        .tileSprite(0, 0, width, height, name)
        .setOrigin(0, 0)
        .setScrollFactor(0, 0)
        .setPosition(0, 0)
        .setSize(width, height),
    );
  };

  const update = () => {
    bgs.forEach((bg, i) => {
      bg.tilePositionX = scene.cameras.main.scrollX * ((i + 1) / 10);
    });
  };

  return { preLoad, create, update };
};

export default parallax;
