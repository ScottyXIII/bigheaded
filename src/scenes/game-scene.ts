import { Scene, GameObjects } from 'phaser';
import toggleDebug from '@/helpers/toggleDebug';
import parallax from '@/objects/parallax';

const cx = window.innerWidth / 2;
const cy = window.innerHeight / 2;

class GameScene extends Scene {
  private textbox: GameObjects.Text | undefined;

  constructor() {
    super('scene-game');
  }

  preload() {
    const { preLoad } = parallax(this);
    preLoad();
  }

  create() {
    // toggle debug GFX
    // toggleDebug(this);
    this.input.keyboard?.on('keydown-CTRL', () => toggleDebug(this));

    this.matter.world.setBounds();
    this.matter.add.mouseSpring();

    const { create } = parallax(this);
    create();

    this.textbox = this.add
      .text(cx, cy, 'game-scene!', {
        color: '#FFF',
        fontFamily: 'monospace',
        fontSize: '26px',
      })
      .setOrigin(0.5, 0.5);
  }

  update(_time: number, delta: number) {
    if (!this.textbox) return;

    this.textbox.rotation += 0.005 * delta;
  }
}

export default GameScene;
