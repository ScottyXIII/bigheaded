import * as Phaser from 'phaser';
import Entity from '@/objects/Entity';
import keepUprightStratergies from '@/objects/Enums/Physics';

const KEY = 'hedgehog';

const entityConfig = {
  name: 'hedgehog',
  spriteSheetKey: 'hedgehog',
  keepUprightStratergy: keepUprightStratergies.INSTANT,
  facing: -1,
  scale: 2.5,
  maxSpeedX: 3,
  maxSpeedY: 10,
  physicsConfig: {
    bounce: 1,
    shape: {
      type: 'rectangle',
      width: 125, 
      height: 50 
    },
  },
  collideCallback: (_sensorName: string, _gameObject: Phaser.GameObjects.Container) => {
  },
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
    
    this.scene.anims.create({
      key: 'sleeping',
      frameRate: 3,
      frames: this.scene.anims.generateFrameNumbers(KEY, { frames: [ 12, 13, 14, 15 ] }),
      repeat: -1
    });
  }
  
  update(_time: number, delta: number) {
    super.update();
    const { angularVelocity } = this.gameObject.body;
    const speed = Math.hypot(this.gameObject.body.velocity.x, this.gameObject.body.velocity.y);
    const motion = speed + Math.abs(angularVelocity);
    const closeToStationary = motion <= 0.1;
    const { player } = this.scene;

    if (closeToStationary) {
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
