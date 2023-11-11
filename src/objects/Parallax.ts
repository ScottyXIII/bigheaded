import * as Phaser from 'phaser';

const parallaxPath = './level/parallax';

const getImageData = (assetName: string, imgCount: number) => {
  const images = Array.from({ length: imgCount }, (_, index) => {
    const indexPlus = index + 1;
    return {
      index: indexPlus,
      name: `${assetName}${indexPlus}`,
      imagePath: `${parallaxPath}/${assetName}/${indexPlus}.png`,
    };
  });
  return images;
};

class Parallax {
  private scene: Phaser.Scene;

  private layers: Phaser.GameObjects.TileSprite[];

  static preload(scene: Phaser.Scene, assetName: string, imgCount: number) {
    const images = getImageData(assetName, imgCount);
    images.forEach(({ name, imagePath }) => scene.load.image(name, imagePath));
  }

  constructor(scene: Phaser.Scene, assetName: string, imgCount: number) {
    this.scene = scene;

    const { width, height } = scene.scale;

    const images = getImageData(assetName, imgCount);
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
        this.scene.cameras.main.scrollX * ((i + 1) / (this.layers.length * 10));
    }
  }
}

export default Parallax;
