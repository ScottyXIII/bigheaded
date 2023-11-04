import * as Phaser from 'phaser';

class Bob1 extends Phaser.GameObjects.Container {
  static preload(scene: Phaser.Scene) {
    scene.load.image('head1', '/head1.png');
    scene.load.image('body1', '/body1.png');
  }

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.scene = scene;

    const head = this.scene.matter.add.image(x, y, 'head1', undefined, {
      shape: 'circle',
      friction: 0.005,
      restitution: 0.6,
    });
    head.setScale(0.4);
    const body = this.scene.matter.add.image(x, y + 100, 'body1', undefined, {
      shape: 'rectangle',
      friction: 0.005,
      restitution: 0.6,
    });

    this.scene.matter.add.constraint(
      head.body?.gameObject,
      body.body?.gameObject,
      200,
      0.005,
      {
        pointA: { x: 20, y: -5 },
        pointB: { x: -60, y: 0 },
      },
    );
    this.scene.matter.add.constraint(
      head.body?.gameObject,
      body.body?.gameObject,
      200,
      0.005,
      {
        pointA: { x: -20, y: -5 },
        pointB: { x: 60, y: 0 },
      },
    );
    this.scene.matter.add.constraint(
      head.body?.gameObject,
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

  // eslint-disable-next-line class-methods-use-this
  update() {
    // eslint-disable-next-line no-useless-return
    // if (!this.scene) return;
  }
}

export default Bob1;
