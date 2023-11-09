import { Scene, GameObjects } from 'phaser';
import parallax from '@/objects/parallax';
import Ball from '@/objects/ball';

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

    Ball.preload(this);
  }

  create() {
    const { create } = parallax(this);
    create();

    // eslint-disable-next-line no-unused-vars
    const x = new Ball(this, cx, cy);

    this.textbox = this.add.text(cx, cy, 'Welcome to Phaser x Vite!', {
      color: '#FFF',
      fontFamily: 'monospace',
      fontSize: '26px',
    });

    this.textbox.setOrigin(0.5, 0.5);
  }

  update(_time: number, delta: number) {
    if (!this.textbox) {
      return;
    }

    this.textbox.rotation += 0.0005 * delta;
  }
}

export default GameScene;
