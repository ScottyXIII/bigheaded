import { Scene, GameObjects } from 'phaser';
import toggleDebug from '@/helpers/toggleDebug';
import smoothMoveCameraTowards from '@/helpers/smoothMoveCameraTowards';
import parallax from '@/objects/parallax';
import Ball from '@/objects/ball';
import Ben1 from '../characters/ben1/Ben';

const cx = window.innerWidth / 2;
const cy = window.innerHeight / 2;

class GameScene extends Scene {
  public ben: Ben1 | undefined;

  private textbox: GameObjects.Text | undefined;

  private ball: Ball | undefined;

  constructor() {
    super('scene-game');
  }

  preload() {
    Ben1.preload(this);

    const { preLoad } = parallax(this);
    preLoad();

    Ball.preload(this);
  }

  create() {
    // toggle debug GFX
    // toggleDebug(this);
    this.input.keyboard?.on('keydown-CTRL', () => toggleDebug(this));

    this.matter.world.setBounds();
    this.matter.add.mouseSpring();

    const { create } = parallax(this);
    create();

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

    this.ball = new Ball(this, cx, cy);

    this.textbox.setOrigin(0.5, 0.5);
  }

  update(_time: number, delta: number) {
    if (!this.textbox || !this.ben || !this.ball) return;

    this.textbox.rotation += 0.005 * delta;

    this.ben.update(_time, delta);

    smoothMoveCameraTowards(this, this.ben.head, 0.9);
  }
}

export default GameScene;
