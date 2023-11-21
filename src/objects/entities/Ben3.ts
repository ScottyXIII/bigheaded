import * as Phaser from 'phaser';
import Entity, { EntityConfigType } from '@/objects/entities/Entity';
import keepUprightStratergies from '@/objects/Enums/KeepUprightStratergies';

const KEY = 'ben3';

const entityConfig: EntityConfigType = {
  name: KEY,
  spriteSheetKey: KEY,
  keepUprightStratergy: keepUprightStratergies.SPRINGY,
  facing: -1,
  scale: 1.5,
  maxSpeedX: 2,
  maxSpeedY: 8,
  craftpixOffset: {
    x: 0,
    y: -35,
  },
  physicsConfig: {
    type: 'rectangle',
    width: 24,
    height: 24,
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
      start: 1,
      end: 5,
      repeat: -1,
    },
  ],
};

class Ben3 extends Entity {
  static preload(scene: Phaser.Scene) {
    scene.load.spritesheet({
      key: KEY,
      url: './object/enemies/tomato.png',
      frameConfig: {
        frameWidth: 96,
        frameHeight: 96,
      },
    });
  }

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, entityConfig);

    this.scene = scene;

    this.playAnimation('movement');
  }
}

export default Ben3;
