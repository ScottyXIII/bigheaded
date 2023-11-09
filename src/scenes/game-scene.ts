import { Scene, GameObjects } from 'phaser';
import parallax from '@/objects/parallax';

class GameScene extends Scene {
  private textbox: GameObjects.Text | undefined;

  constructor() {
    super('scene-game');
  }

  create() {
    const { preLoad, create } = parallax(this);
    preLoad();
    create();

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
    if (!this.textbox) {
      return;
    }

    this.textbox.rotation += 0.0005 * delta;
  }
}

export default GameScene;
