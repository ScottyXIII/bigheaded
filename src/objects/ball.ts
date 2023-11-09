import * as Phaser from 'phaser';

class Ball extends Phaser.GameObjects.Container {
  public ball: Phaser.GameObjects.Image | undefined;

  static preload(scene: Phaser.Scene) {
    scene.load.image('tennisball', '/tennisball.png');
  }

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.scene = scene;

    this.ball = this.scene.matter.add.image(x, y, 'tennisball', undefined, {
      shape: 'circle',
      friction: 0.005,
      restitution: 0.1,
    });
  }
}

export default Ball;
