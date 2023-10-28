import { Scene, GameObjects } from 'phaser';

class GameScene extends Scene {
  private textbox: GameObjects.Text | undefined;

  constructor() {
    super('scene-game');
  }

  preload() {
    this.load.image('sun', 'https://labs.phaser.io/assets/tests/space/sun.png');
    this.load.image(
      'alien',
      'https://labs.phaser.io/assets/sprites/space-baddie.png',
    );
  }

  create() {
    // this.matter.world.setBounds();
    this.matter.add.mouseSpring();

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

    this.matter.add.imageStack(
      'alien',
      0,
      window.innerWidth / 2,
      window.innerHeight / 2,
      10,
      10,
      0,
      0,
      {
        // mass: 1,
        restitution: 0.1,
        // ignorePointer: true,
        friction: 0,
        frictionAir: 0,
        frictionStatic: 0,
        shape: 'circle',
        plugin: {
          attractors: [
            (bodyA: any, bodyB: any) => ({
              x: (bodyA.position.x - bodyB.position.x) * 0.00000000001,
              y: (bodyA.position.y - bodyB.position.y) * 0.00000000001,
            }),
          ],
        },
      },
    );

    // const sun =
    this.matter.add.image(
      window.innerWidth / 2,
      window.innerHeight / 2,
      'sun',
      0,
      {
        shape: {
          type: 'circle',
          radius: 64,
        },
        plugin: {
          attractors: [
            (bodyA: any, bodyB: any) => ({
              x: (bodyA.position.x - bodyB.position.x) * 0.000000001,
              y: (bodyA.position.y - bodyB.position.y) * 0.000000001,
            }),
          ],
        },
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
