import * as Phaser from 'phaser';
import Entity, { EntityConfigType } from '@/objects/entities/Entity';
import keepUpright, { KeepUprightStratergies } from '@/helpers/keepUpright';
import moveTowards from '@/helpers/moveTowards';

const KEY = 'bat';

const entityConfig: EntityConfigType = {
  name: KEY,
  spriteSheetKey: KEY,
  facing: -1,
  scale: 1.5,
  maxSpeedX: 1,
  maxSpeedY: 2,
  constantMotion: true,
  physicsConfig: {
    type: 'rectangle',
    width: 32,
    height: 32,
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

  update() {
    keepUpright(KeepUprightStratergies.SPRINGY, this.gameObject);
    // moveTowards(this, player);
  }
}

export default Bat;
