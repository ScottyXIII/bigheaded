import * as Phaser from 'phaser';

class Bob1 extends Phaser.GameObjects.Container {
  public head: Phaser.GameObjects.Image | undefined;

  private torso: Phaser.GameObjects.Image | undefined;

  private headSize = 0.2;

  private headScaleDirection = 1; // 1 or minus 1

  private neck: Phaser.Types.Physics.Matter.MatterConstraintConfig;

  static preload(scene: Phaser.Scene) {
    scene.load.image('head1', '/head1.png');
    scene.load.image('body1', '/body1.png');
  }

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.scene = scene;

    this.torso = this.scene.matter.add.image(x, y + 100, 'body1', undefined, {
      shape: 'rectangle',
      friction: 0.005,
      restitution: 0.1,
    });

    this.head = this.scene.matter.add.image(x, y, 'head1', undefined, {
      shape: 'circle',
      friction: 0.005,
      restitution: 1,
    });
    this.head.setScale(0.4);

    this.neck = this.scene.matter.add.constraint(
      this.head.body?.gameObject,
      this.torso.body?.gameObject,
      0,
      0.5,
      {
        pointA: { x: 0, y: this.headSize * 180 },
        pointB: { x: 0, y: -80 },
        damping: 0,
        angularStiffness: 0,
      },
    );
  }

  update() {
    if (!this.head || !this.torso || !this.neck) return;
    this.head.setScale(this.headSize);
    if (this.headSize > 1.3) this.headScaleDirection = -1;
    if (this.headSize < 0.4) this.headScaleDirection = 1;

    this.headSize += 0.001 * this.headScaleDirection;

    const vec = new Phaser.Math.Vector2(0, this.headSize * 180).rotate(
      this.head.rotation,
    );

    this.neck.pointA = vec;
  }
}

export default Bob1;
