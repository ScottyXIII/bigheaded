import * as Phaser from 'phaser';
import Entity from '@/objects/entities/Entity';
import keepUprightStratergies from '@/objects/Enums/Physics';

const KEY = 'hedgehog';

const entityConfig = {
  name: KEY,
  spriteSheetKey: KEY,
  keepUprightStratergy: keepUprightStratergies.SPRINGY,
  facing: -1,
  scale: 2,
  maxSpeedX: 1,
  maxSpeedY: 2,
  physicsConfig: {
    bounce: 1,
    shape: {
      type: 'rectangle',
      width: 70,
      height: 48,
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
      repeat: -1,
    },
  ],
};

class Hedgehog extends Entity {
  static preload(scene: Phaser.Scene) {
    scene.load.spritesheet({
      key: KEY,
      url: './object/enemies/hedgehog.png',
      frameConfig: {
        frameWidth: 24,
        frameHeight: 24,
      },
    });
  }

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, entityConfig);

    this.scene = scene;

    this.playAnimation('idle');
  }
}

export default Hedgehog;
