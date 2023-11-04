import { Scene, GameObjects } from 'phaser';

class GameScene extends Scene {
  private textbox: GameObjects.Text | undefined;

  constructor() {
    super('scene-game');
  }

  preload() {
    this.load.image(
      'ball',
      'https://labs.phaser.io/assets/sprites/shinyball.png',
    );
    this.load.image('block', 'https://labs.phaser.io/assets/sprites/block.png');
    this.load.image('head1', 'public/head1.png');
    this.load.image('body1', 'public/body1.png');
  }

  create() {
    this.textbox = this.add.text(
      window.innerWidth / 2,
      window.innerHeight / 2,
      'Welcome to Phaser x Vite!',
      {
        color: '#FFF',
        fontFamily: 'monospace',
        fontSize: '26px',
      },
    );

    this.textbox.setOrigin(0.5, 0.5);

    this.matter.world.setBounds();
    this.matter.add.mouseSpring();

    const ballA = this.matter.add.image(420, 100, 'head1', undefined, {
      shape: 'circle',
      friction: 0.005,
      restitution: 0.6,
    });
    ballA.setScale(0.4);
    const ballB = this.matter.add.image(400, 200, 'body1', undefined, {
      shape: 'rectangle',
      friction: 0.005,
      restitution: 0.6,
    });

    this.matter.add.constraint(
      ballA.body?.gameObject,
      ballB.body?.gameObject,
      200,
      0.005,
      {
        pointA: { x: 20, y: -5 },
        pointB: { x: -60, y: 0 },
      },
    );
    this.matter.add.constraint(
      ballA.body?.gameObject,
      ballB.body?.gameObject,
      200,
      0.005,
      {
        pointA: { x: -20, y: -5 },
        pointB: { x: 60, y: 0 },
      },
    );
    this.matter.add.constraint(
      ballA.body?.gameObject,
      ballB.body?.gameObject,
      50,
      0.005,
      {
        pointA: { x: 0, y: 20 },
        pointB: { x: 0, y: -50 },
      },
    );
  }

  update(_time: number, delta: number) {
    if (!this.textbox) {
      return;
    }

    this.textbox.rotation += 0.0005 * delta;
  }
}

export default GameScene;
