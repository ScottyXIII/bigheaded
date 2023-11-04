import { Scene, GameObjects } from 'phaser';
import Ben1 from '../characters/ben1/Ben';

const toggleDebug = (scene: Scene) => {
  // eslint-disable-next-line no-param-reassign
  scene.matter.world.drawDebug = !scene.matter.world.drawDebug;
  scene.matter.world.debugGraphic.clear();
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
    toggleDebug(this);
    this.input.keyboard?.on('keydown-CTRL', () => toggleDebug(this));

    this.matter.world.setBounds();
    this.matter.add.mouseSpring();

    // setTimeout(() => {
    this.ben = new Ben1(this, 500, 500);
    // }, 500);

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
  }

  update(_time: number, delta: number) {
    if (!this.textbox || !this.ben) {
      return;
    }

    this.textbox.rotation += 0.0005 * delta;

    // this.ben.update();
  }
}

export default GameScene;
