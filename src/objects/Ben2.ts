import * as Phaser from 'phaser';
import keepUpright from '@/helpers/keepUpright';
import matterAddImageEllipse from '@/helpers/matterAddImageEllipse';

const HEAD_SCALE_MIN = 0.1;
const HEAD_SCALE_MAX = 1.5;

class Ben2 extends Phaser.GameObjects.Container {
  public head: Phaser.Physics.Matter.Image | undefined;

  public torso: Phaser.Physics.Matter.Image | undefined;

  public neck: Phaser.Types.Physics.Matter.MatterConstraintConfig;

  public headScale = HEAD_SCALE_MIN;

  private headScaleDirection = 1; // 1 or minus 1

  static preload(scene: Phaser.Scene) {
    scene.load.image('head2', './object/ben2/head2.png');
    scene.load.image('body2', './object/ben2/body2.png');
  }

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.scene = scene;

    this.torso = matterAddImageEllipse(scene, x, y + 50, 'body2', undefined, {
      width: 75,
      height: 100,
      friction: 0,
      restitution: 0.1,
    });
    this.torso.setScale(0.75);

    this.head = matterAddImageEllipse(scene, x, y, 'head2', undefined, {
      width: 340,
      height: 270,
      friction: 0,
    });
    this.head.setScale(HEAD_SCALE_MIN);

    this.neck = scene.matter.add.constraint(
      this.head.body?.gameObject,
      this.torso.body?.gameObject,
      0,
      0.5,
      {
        pointA: { x: 0, y: this.headScale * 140 },
        pointB: { x: 0, y: -75 / 2 },
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

    this.headScale += 0.00001 * this.headScaleDirection * delta;

    this.neck.pointA = new Phaser.Math.Vector2(0, this.headScale * 140).rotate(
      this.head.rotation,
    );

    keepUpright(this.head.body, { multiplier: 0.005, avDampener: 0.999 });
    keepUpright(this.torso.body, { multiplier: 0.05, avDampener: 0.999 });
  }

  enactAction(action: number) {
    if (!this.torso) return;

    const xyForce = { x: action / 5000, y: 0 };

    // @ts-ignore
    Phaser.Physics.Matter.Matter.Body.applyForce(
      this.torso.body,
      this.torso.getCenter(),
      xyForce,
    );
  }
}

export default Ben2;
