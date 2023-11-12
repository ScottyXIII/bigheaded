import * as Phaser from 'phaser';

class Ball extends Phaser.GameObjects.Container {
  public ball: Phaser.GameObjects.Image | undefined;

  private imageScale: number = 0;
  private growthScale: number = 0.01;

  static preload(scene: Phaser.Scene) {
    scene.load.image('tennisball', '/tennisball.png');
  }

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.scene = scene;
    this.imageScale = 0.1;

    this.ball = this.scene.matter.add
      .image(x, y, 'tennisball', undefined, {
        shape: 'circle',
        friction: 0.1,
        restitution: 0.5,
      })
      .setScale(this.imageScale)
      .setDepth(10)
      .setOnCollide((data: any) => {
        if (data.bodyA.collisionFilter.category == 10) {
          this.scene.scene.restart();
        }
      })
  }

  public grow(): void {
    this.imageScale += this.growthScale;
    this.ball?.setScale(this.imageScale);
  }
}

export default Ball;
