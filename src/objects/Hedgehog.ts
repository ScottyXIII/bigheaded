import * as Phaser from 'phaser';
import Entity from '@/objects/Entity';
import keepUprightStratergies from '@/objects/Enums/Physics';

const KEY = 'hedgehog';

const entityConfig = {
  name: 'hedgehog',
  spriteSheetKey: 'hedgehog',
  keepUprightStratergy: keepUprightStratergies.SPRINGY,
  facing: -1,
  scale: 2,
  maxSpeedX: 3,
  maxSpeedY: 15,
  physicsConfig: {
    bounce: 1,
    shape: {
      type: 'rectangle',
      width: 48, 
      height: 48 
    },
  },
  animations: [
    { 
      animationKey: 'idle',
      fps: 3,
      start: 1,
      end: 1,
    },
    { 
      animationKey: 'sleeping',
      fps: 3,
      start: 12,
      end: 15,
      repeat: -1
    }
  ]
};

class Hedgehog extends Entity {
  static preload(scene: Phaser.Scene) {
    scene.load.spritesheet({
      key: KEY,
      url: './object/enemies/hedgehog.png',
      frameConfig: {
        frameWidth: 24,
        frameHeight: 24,
      }
    });
  }

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(
      scene, 
      x, 
      y,
      entityConfig
    );

    this.scene = scene;
    
    this.playAnimation("idle");
  }
  
  update(_time: number, delta: number) {
    super.update();
    const { angularVelocity } = this.gameObject.body;
    const speed = Math.hypot(this.gameObject.body.velocity.x, this.gameObject.body.velocity.y);
    const motion = speed + Math.abs(angularVelocity);
    const closeToStationary = motion <= 0.1;
    const { player } = this.scene;

    if (closeToStationary && player != undefined) {
      const vectorTowardsPlayer = {
        x: player.torso.x - this.x,
        y: player.torso.y - this.y,
      };
      this.gameObject.setVelocity?.(
        vectorTowardsPlayer.x < 0 ? -this.maxSpeedX : this.maxSpeedX,
        -this.maxSpeedY,
      );
    }
  }
}

export default Hedgehog;
