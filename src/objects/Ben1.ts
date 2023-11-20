import * as Phaser from 'phaser';

const HEAD_SCALE_MIN = 0.15;
const HEAD_SCALE_MAX = 1.5;

class Ben1 extends Phaser.GameObjects.Container {
  public head: Phaser.GameObjects.Image | undefined;

  public torso: Phaser.GameObjects.Image | undefined;

  public headScale = HEAD_SCALE_MIN;

  private headScaleDirection = 1; // 1 or minus 1

  private neck: Phaser.Types.Physics.Matter.MatterConstraintConfig;

  static preload(scene: Phaser.Scene) {
    scene.load.image('head1', './object/ben1/head.png');
    scene.load.image('body1', './object/ben1/body.png');
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
    this.head.setScale(HEAD_SCALE_MIN);

    this.neck = this.scene.matter.add.constraint(
      this.head.body?.gameObject,
      this.torso.body?.gameObject,
      0,
      0.5,
      {
        pointA: { x: 0, y: this.headScale * 180 },
        pointB: { x: 0, y: -80 },
        damping: 0,
        angularStiffness: 0,
      },
    );
  }

  update(_time: number, delta: number) {
    if (!this.head || !this.torso || !this.neck) return;

    this.head.setScale(this.headScale);
    if (this.headScale > HEAD_SCALE_MAX) this.headScaleDirection = -1;
    if (this.headScale < HEAD_SCALE_MIN) this.headScaleDirection = 1;

    this.headScale += 0.00005 * this.headScaleDirection * delta;

    this.neck.pointA = new Phaser.Math.Vector2(0, this.headScale * 180).rotate(
      this.head.rotation,
    );
  }

  enactAction(action: number) {
    if (!this.torso) return;

    const xyForce = { x: action / 10, y: 0 };

    // @ts-expect-error we down know TS that well yet
    Phaser.Physics.Matter.Matter.Body.applyForce(
      this.torso.body,
      this.torso.getCenter(),
      xyForce,
    );
  }
}

export default Ben1;
