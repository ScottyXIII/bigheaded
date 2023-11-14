import * as Phaser from 'phaser';

const parallaxPath = './level/parallax';

const parallaxConfig = {
  blueforest: { imgCount: 6 },
  forest2022: { imgCount: 8 },
  mountain: { imgCount: 5 },
  supermountaindusk: { imgCount: 6 },
};

export type ParallaxNames = keyof typeof parallaxConfig;

const getImageData = (parallaxName: ParallaxNames) => {
  const { imgCount } = parallaxConfig[parallaxName];
  const images = Array.from({ length: imgCount }, (_, index) => {
    const indexPlus = index + 1;
    return {
      index: indexPlus,
      name: `${parallaxName}-${indexPlus}`,
      imagePath: `${parallaxPath}/${parallaxName}/${indexPlus}.png`,
    };
  });
  return images;
};

class Parallax {
  private scene: Phaser.Scene;

  private layers: Phaser.GameObjects.TileSprite[];

  static preload(scene: Phaser.Scene, parallaxName: ParallaxNames) {
    const images = getImageData(parallaxName);
    images.forEach(({ name, imagePath }) => scene.load.image(name, imagePath));
  }

  constructor(scene: Phaser.Scene, parallaxName: ParallaxNames) {
    this.scene = scene;

    const { width, height } = scene.scale;

    const images = getImageData(parallaxName);
    this.layers = images.map(({ name }) =>
      scene.add
        .tileSprite(0, 0, width, height, name)
        .setOrigin(0, 0)
        .setScrollFactor(0, 0)
        .setTileScale(height / this.scene.textures.get(name).source[0].height),
    );
  }

  update() {
    for (let i = 0; i < this.layers.length; i += 1) {
      this.layers[i].tilePositionX =
        this.scene.cameras.main.scrollX * (i / (this.layers.length * 10));
    }
  }
}

export default Parallax;
