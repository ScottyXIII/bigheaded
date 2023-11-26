import * as Phaser from 'phaser';

class Skull extends Phaser.GameObjects.Container {
  public skull: Phaser.GameObjects.Image;

  static preload(scene: Phaser.Scene) {
    scene.load.image('skull', './object/items/skull.png');
  }

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.scene = scene;

    this.skull = this.scene.matter.add
      .image(x, y, 'skull', undefined, {
        shape: 'rectangle',
        friction: Infinity,
        restitution: 0,
      })
      .setScale(0.1)
      .setDepth(10);
  }
}

export default Skull;
