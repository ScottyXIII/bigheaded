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

    this.ben = new Ben1(this, 500, 900);

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
