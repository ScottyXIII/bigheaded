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

    const ballA = this.matter.add.image(420, 100, 'ball', undefined, {
      shape: 'circle',
      friction: 0.005,
      restitution: 0.6,
    });
    const ballB = this.matter.add.image(400, 200, 'block', undefined, {
      shape: 'rectangle',
      friction: 0.005,
      restitution: 0.6,
    });

    this.matter.add.constraint(
      ballA.body?.gameObject,
      ballB.body?.gameObject,
      100,
      0.01,
      {
        pointA: { x: 0, y: 0 },
        pointB: { x: -30, y: 0 },
      },
    );
    this.matter.add.constraint(
      ballA.body?.gameObject,
      ballB.body?.gameObject,
      100,
      0.01,
      {
        pointA: { x: 0, y: 0 },
        pointB: { x: 30, y: 0 },
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
