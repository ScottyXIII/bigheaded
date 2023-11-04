import * as Phaser from 'phaser';

class Bob1 extends Phaser.GameObjects.Container {
  private head: Phaser.GameObjects.Image | undefined;

  private headSize = 0.1;

  static preload(scene: Phaser.Scene) {
    scene.load.image('head1', '/head1.png');
    scene.load.image('body1', '/body1.png');
  }

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.scene = scene;

    this.head = this.scene.matter.add.image(x, y, 'head1', undefined, {
      shape: 'circle',
      friction: 0.005,
      restitution: 0.6,
    });
    this.head.setScale(0.4);
    const body = this.scene.matter.add.image(x, y + 100, 'body1', undefined, {
      shape: 'rectangle',
      friction: 0.005,
      restitution: 0.6,
    });

    this.scene.matter.add.constraint(
      this.head.body?.gameObject,
      body.body?.gameObject,
      200,
      0.005,
      {
        pointA: { x: 20, y: -5 },
        pointB: { x: -60, y: 0 },
      },
    );
    this.scene.matter.add.constraint(
      this.head.body?.gameObject,
      body.body?.gameObject,
      200,
      0.005,
      {
        pointA: { x: -20, y: -5 },
        pointB: { x: 60, y: 0 },
      },
    );
    this.scene.matter.add.constraint(
      this.head.body?.gameObject,
      body.body?.gameObject,
      50,
      0.005,
      {
        pointA: { x: 0, y: 20 },
        pointB: { x: 0, y: -50 },
      },
    );

    // console.log('created ben!');
  }

  update() {
    if (!this.head) return;
    this.head.setScale(this.headSize);
    this.headSize += 0.001;
  }
}

export default Bob1;
