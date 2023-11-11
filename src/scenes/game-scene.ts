import { Scene, GameObjects } from 'phaser';
import toggleDebug from '@/helpers/toggleDebug';
import smoothMoveCameraTowards from '@/helpers/smoothMoveCameraTowards';
import Parallax from '@/objects/Parallax';
import Ball from '@/objects/ball';

const cx = window.innerWidth / 2;
const cy = window.innerHeight / 2;

class GameScene extends Scene {
  private textbox: GameObjects.Text | undefined;

  private ball: Ball | undefined;

  private parallax: Parallax | undefined;

  constructor() {
    super('scene-game');
  }

  preload() {
    // Parallax.preload(this, 'forest2022', 8);
    Parallax.preload(this, 'mountain', 5);
    Ball.preload(this);
  }

  create() {
    // toggle debug GFX
    // toggleDebug(this);
    this.input.keyboard?.on('keydown-CTRL', () => toggleDebug(this));

    this.matter.world.setBounds();
    this.matter.add.mouseSpring();

    // this.parallax = new Parallax(this, 'forest2022', 8);
    this.parallax = new Parallax(this, 'mountain', 5);

    this.ball = new Ball(this, cx, cy);

    this.textbox = this.add.text(cx, cy, 'Welcome to Phaser x Vite!', {
      color: '#FFF',
      fontFamily: 'monospace',
      fontSize: '26px',
    });

    this.textbox.setOrigin(0.5, 0.5);
  }

  update(_time: number, delta: number) {
    if (!this.parallax || !this.textbox || !this.ball) return;

    this.textbox.rotation += 0.0005 * delta;

    smoothMoveCameraTowards(this, this.ball.ball, 0.9);

    this.parallax.update();
  }
}

export default GameScene;
