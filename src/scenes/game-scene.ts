import { Scene, GameObjects } from 'phaser';
import toggleDebug from '@/helpers/toggleDebug';
import smoothMoveCameraTowards from '@/helpers/smoothMoveCameraTowards';
import parallax from '@/objects/parallax';
import Ball from '@/objects/ball';
import Map from '@/map/Map';

const cx = window.innerWidth / 2;
const cy = window.innerHeight / 2;

class GameScene extends Scene {

  private textbox: GameObjects.Text | undefined;

  private ball: Ball | undefined;

  private map: Map | undefined;

  constructor() {
    super('scene-game');
    this.map = new Map(this);
  }

  preload() {
    const { preLoad } = parallax(this);
    preLoad();

    this.map?.preload();
    Ball.preload(this);
  }

  create() {
    // toggle debug GFX
    // toggleDebug(this);
    this.input.keyboard?.on('keydown-CTRL', () => toggleDebug(this));

    this.matter.add.mouseSpring();

    const { create } = parallax(this);
    create();
    
    this.map?.create();
    this.matter.world.setBounds(this.map?.x, this.map?.y, this.map?.width, this.map?.height);

    const playerPos = this.map?.spawners.player;
    
    this.ball = new Ball(this, playerPos.x, playerPos.y);
    
    this.textbox = this.add.text(cx, cy, 'Welcome to Phaser x Vite!', {
      color: '#FFF',
      fontFamily: 'monospace',
      fontSize: '26px',
    });
    this.textbox.setOrigin(0.5, 0.5);
  }

  update(_time: number, delta: number) {
    if (!this.textbox || !this.ball) {
      return;
    }

    this.textbox.rotation += 0.0005 * delta;

    smoothMoveCameraTowards(this, this.ball.ball, 0.9);
  }
}

export default GameScene;
