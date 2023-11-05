import { Scene, GameObjects } from 'phaser';
import Ben1 from '../characters/ben1/Ben';

const toggleDebug = (scene: Scene) => {
  // eslint-disable-next-line no-param-reassign
  scene.matter.world.drawDebug = !scene.matter.world.drawDebug;
  scene.matter.world.debugGraphic.clear();
};

const smoothMoveCameraTowards = (
  scene: Scene,
  target: GameObjects.Image | undefined,
  smoothFactor = 0,
) => {
  if (!target) return;
  const cam = scene.cameras.main;
  cam.scrollX =
    smoothFactor * cam.scrollX +
    (1 - smoothFactor) * (target.x - cam.width * 0.5);
  cam.scrollY =
    smoothFactor * cam.scrollY +
    (1 - smoothFactor) * (target.y - cam.height * 0.6);
};

class GameScene extends Scene {
  private ben: Ben1 | undefined;

  private textbox: GameObjects.Text | undefined;

  private sun: GameObjects.Image | undefined;

  constructor() {
    super('scene-game');
  }

  preload() {
    Ben1.preload(this);
  }

  create() {
    // toggle debug GFX
    // toggleDebug(this);
    this.input.keyboard?.on('keydown-CTRL', () => toggleDebug(this));

    this.matter.world.setBounds();
    this.matter.add.mouseSpring();

    this.ben = new Ben1(this, window.innerWidth / 2, window.innerHeight / 2);

    this.textbox = this.add.text(
      window.innerWidth / 2,
      window.innerHeight / 2,
      'Big Ed!',
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

    this.sun = this.matter.add.image(
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
    if (!this.textbox || !this.ben) {
      return;
    }

    this.textbox.rotation += 0.005 * delta;

    this.ben.update(_time, delta);

    smoothMoveCameraTowards(this, this.ben.head, 0.9);
  }
}

export default GameScene;
