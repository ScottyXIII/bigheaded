import * as Phaser from 'phaser';
import Entity, { EntityConfigType } from '@/objects/entities/Entity';
import keepUpright, { KeepUprightStratergies } from '@/helpers/keepUpright';
import GameScene from '@/scenes/game-scene';

const KEY = 'ben3';

const entityConfig: EntityConfigType = {
  name: KEY,
  spriteSheetKey: KEY,
  facing: 1,
  scale: 1,
  maxSpeedX: 2,
  maxSpeedY: 8,
  craftpixOffset: {
    x: 0,
    y: 0,
  },
  constantMotion: false,
  physicsConfig: {
    type: 'rectangle',
    width: 75,
    height: 75,
    chamfer: { radius: 20 },
  },
  animations: [
    {
      animationKey: 'idle',
      fps: 5,
      start: 0,
      end: 3,
    },
  ],
};

class Ben3 extends Entity {
  static preload(scene: Phaser.Scene) {
    scene.load.spritesheet({
      key: KEY,
      url: './object/ben3/body-animation.png',
      frameConfig: {
        frameWidth: 75,
        frameHeight: 75,
      },
    });
  }

  constructor(scene: GameScene, x: number, y: number) {
    super(scene, x, y, entityConfig);

    this.scene = scene;

    this.playAnimation('idle');
  }

  update() {
    super.update();
    keepUpright(KeepUprightStratergies.SPRINGY, this.gameObject);
    // perhaps use moveTowards to go to goal marker?
  }
}

export default Ben3;
