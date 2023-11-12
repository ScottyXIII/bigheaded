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

  private map: any;

  private coinGroup: any;
  private coinPool: any;

  constructor() {
    super('scene-game');
  }

  preload() {
    const { preLoad } = parallax(this);
    preLoad();

    this.map = new Map(this);

    this.map.preload();
    Ball.preload(this);

    //coin 
    this.load.spritesheet("coin", "coins.png", {
      frameWidth: 16,
      frameHeight: 16
    });
  }

  create() {
    // toggle debug GFX
    // toggleDebug(this);
    this.input.keyboard?.on('keydown-CTRL', () => toggleDebug(this));
    this.matter.add.mouseSpring();

    const { create } = parallax(this);
    create();
    
    this.map.create();
    this.matter.world.setBounds(this.map.x, this.map.y, this.map.width, this.map.height);

    let playerPos = this.map.spawners.player;
    
    this.ball = new Ball(this, playerPos.x, playerPos.y);

     //coin animation
     this.anims.create({
      key: "rotate",
      frames: this.anims.generateFrameNumbers("coin", {
          start: 0,
          end: 5
      }),
      frameRate: 15,
      yoyo: true,
      repeat: -1
    });

    this.map.spawners.coins.forEach((coin: any) => {
      let sprite = this.matter.add.sprite(coin.x, coin.y, 'coin')
      .play("rotate");

      sprite.setOnCollide((data: any) => {
        // add propper collision filters for now we're assuming any collision is the player
        sprite.destroy();
        this.ball?.grow();
      })
      
    });

    this.textbox = this.add.text(cx, cy, 'Collect all coins. You will die if you hit the walls. good luck!', {
      color: '#FFF',
      fontFamily: 'monospace',
      fontSize: '26px',
    });

    this.textbox.setPosition(playerPos.x, playerPos.y);
    this.textbox.setDepth(1000);
  }

  update(_time: number, delta: number) {
    if (!this.textbox || !this.ball) {
      return;
    }

    //this.textbox.rotation += 0.0005 * delta;

    smoothMoveCameraTowards(this, this.ball.ball, 0.9);
  }
}

export default GameScene;
