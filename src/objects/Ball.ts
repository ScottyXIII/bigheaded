import * as Phaser from 'phaser';

class Ball extends Phaser.GameObjects.Container {
  public ball: Phaser.GameObjects.Image | undefined;

  static preload(scene: Phaser.Scene) {
    scene.load.image('tennisball', './object/ball/tennisball.png');
  }

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.scene = scene;

    this.ball = this.scene.matter.add
      .image(x, y, 'tennisball', undefined, {
        shape: 'circle',
        friction: 0.1,
        restitution: 1.2,
      })
      .setScale(0.1)
      .setDepth(10);
  }
}

export default Ball;
