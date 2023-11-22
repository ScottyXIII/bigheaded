import * as Phaser from 'phaser';
import Entity, { EntityConfigType } from '@/objects/entities/Entity';
import keepUpright, { KeepUprightStratergies } from '@/helpers/keepUpright';
import moveTowards from '@/helpers/moveTowards';

const KEY = 'tomato';

const entityConfig: EntityConfigType = {
  name: KEY,
  spriteSheetKey: KEY,
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

class Tomato extends Entity {
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

  update() {
    keepUpright(KeepUprightStratergies.SPRINGY, this.gameObject);
    // moveTowards(this, player);
  }
}

export default Tomato;
