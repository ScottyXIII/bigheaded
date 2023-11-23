import * as Phaser from 'phaser';

class Text extends Phaser.GameObjects.Container {
  private textbox: Phaser.GameObjects.Text;

  static preload() {}

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.scene = scene;

    const text = 'Welcome to Phaser x Vite!';

    this.textbox = scene.add
      .text(x, y, text, {
        color: '#FFF',
        fontFamily: 'monospace',
        fontSize: '26px',
      })
      // .setOrigin(0.5, 0.5)
      .setScrollFactor(0);
  }

  update(_time: number, delta: number) {
    this.textbox.rotation += 0.0005 * delta;
  }
}

export default Text;
