import * as Phaser from 'phaser';
// import * as tf from '@tensorflow/tfjs';
// import Brain from '@/ai/reinforcement-learning/Brain';

const HEAD_SCALE_MIN = 0.15;
const HEAD_SCALE_MAX = 1.5;

class Bob1 extends Phaser.GameObjects.Container {
  // private brain: Brain;

  public head: Phaser.GameObjects.Image | undefined;

  private torso: Phaser.GameObjects.Image | undefined;

  private headScale = HEAD_SCALE_MIN;

  private headScaleDirection = 1; // 1 or minus 1

  private neck: Phaser.Types.Physics.Matter.MatterConstraintConfig;

  static preload(scene: Phaser.Scene) {
    scene.load.image('head1', '/head1.png');
    scene.load.image('body1', '/body1.png');
  }

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.scene = scene;

    // this.brain = new Brain([2, 6, 6, 3]);

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

    // setTimeout(() => this.action(1), 5_000);
  }

  update(_time: number, delta: number) {
    if (!this.head || !this.torso || !this.neck) return;

    this.head.setScale(this.headScale);
    if (this.headScale > HEAD_SCALE_MAX) this.headScaleDirection = -1;
    if (this.headScale < HEAD_SCALE_MIN) this.headScaleDirection = 1;

    this.headScale += 0.000005 * this.headScaleDirection * delta;

    this.neck.pointA = new Phaser.Math.Vector2(0, this.headScale * 180).rotate(
      this.head.rotation,
    );

    // const nnInput = tf.tensor2d([2, 3], [1, 2]);
    // const eps = 1;
    // const actionData = this.brain.choose(nnInput, eps);
    // this.action(actionData);

    // console.log('choose', actionData);
  }

  action(data: number) {
    if (!this.torso) return;

    const actionDirection = { x: data / 10, y: 0 };

    // @ts-ignore
    Phaser.Physics.Matter.Matter.Body.applyForce(
      this.torso.body,
      this.torso.getCenter(),
      actionDirection,
    );
  }
}

export default Bob1;
