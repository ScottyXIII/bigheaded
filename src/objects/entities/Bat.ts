import * as Phaser from 'phaser';
import Entity from '@/objects/entities/Entity';
import keepUprightStratergies from '@/objects/Enums/Physics';

const KEY = 'bat';

const entityConfig = {
  name: KEY,
  spriteSheetKey: KEY,
  keepUprightStratergy: keepUprightStratergies.SPRINGY,
  facing: -1,
  scale: 1.5,
  maxSpeedX: 1,
  maxSpeedY: 2,
  constantMotion: true,
  physicsConfig: {
    bounce: 1,
    shape: {
      type: 'rectangle',
      width: 32,
      height: 32,
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
      animationKey: 'movement',
      fps: 10,
      start: 0,
      end: 5,
      repeat: -1,
    },
  ],
};

class Bat extends Entity {
  static preload(scene: Phaser.Scene) {
    scene.load.spritesheet({
      key: KEY,
      url: './object/enemies/bat.png',
      frameConfig: {
        frameWidth: 32,
        frameHeight: 32,
      },
    });
  }

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, entityConfig);

    this.scene = scene;

    this.playAnimation('movement');
  }
}

export default Bat;
