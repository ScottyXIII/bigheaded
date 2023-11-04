import * as Phaser from 'phaser';

class Bob1 extends Phaser.GameObjects.Container {
  public head: Phaser.GameObjects.Image | undefined;

  private mybody: Phaser.GameObjects.Image | undefined;

  private headSize = 0.2;

  private neck: Phaser.Types.Physics.Matter.MatterConstraintConfig;

  static preload(scene: Phaser.Scene) {
    scene.load.image('head1', '/head1.png');
    scene.load.image('body1', '/body1.png');
  }

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.scene = scene;

    this.mybody = this.scene.matter.add.image(x, y + 100, 'body1', undefined, {
      shape: 'rectangle',
      friction: 0.005,
      restitution: 0.6,
    });

    this.head = this.scene.matter.add.image(x, y, 'head1', undefined, {
      shape: 'circle',
      friction: 0.005,
      restitution: 0.6,
    });
    this.head.setScale(0.4);

    // this.scene.matter.add.constraint(
    //   this.head.body?.gameObject,
    //   body.body?.gameObject,
    //   200,
    //   0.0001,
    //   {
    //     pointA: { x: 20, y: 10 },
    //     pointB: { x: -60, y: -40 },
    //   },
    // );
    // this.scene.matter.add.constraint(
    //   this.head.body?.gameObject,
    //   body.body?.gameObject,
    //   200,
    //   0.0001,
    //   {
    //     pointA: { x: -20, y: 10 },
    //     pointB: { x: 60, y: -40 },
    //   },
    // );
    this.neck = this.scene.matter.add.constraint(
      this.head.body?.gameObject,
      this.mybody.body?.gameObject,
      0,
      0.1,
      {
        pointA: { x: 0, y: 40 },
        pointB: { x: 0, y: -80 },
        damping: 0,
        angularStiffness: 0,
      },
    );
  }

  update() {
    if (!this.head || !this.mybody || !this.neck) return;
    this.head.setScale(this.headSize);
    this.headSize += 0.001;

    // this.scene.matter.world.removeConstraint(this.neck);

    // this.neck = this.scene.matter.add.constraint(
    //   this.head.body?.gameObject,
    //   this.body.body?.gameObject,
    //   0,
    //   0.1,
    //   {
    //     pointA: { x: 0, y: this.headSize * 200 },
    //     pointB: { x: 0, y: -80 },
    //     damping: 0,
    //     angularStiffness: 0,
    //   },
    // );

    // this.neck.pointA = { x: 0, y: this.headSize * -1 };
    console.log(this.neck.pointA);
  }
}

export default Bob1;
