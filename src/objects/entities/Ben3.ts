import * as Phaser from 'phaser';
import Entity, { EntityConfigType } from '@/objects/entities/Entity';
import keepUprightStratergies from '@/objects/Enums/KeepUprightStratergies';

const KEY = 'ben3';

const entityConfig: EntityConfigType = {
  name: KEY,
  spriteSheetKey: KEY,
  keepUprightStratergy: keepUprightStratergies.SPRINGY,
  facing: 1,
  scale: 1,
  maxSpeedX: 2,
  maxSpeedY: 8,
  craftpixOffset: {
    x: 0,
    y: 0,
  },
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
  plugins: [
    (scene, self) => keepUpright(self), //
    (scene, self) => moveTowards(self, scene.player), //
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

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, entityConfig);

    this.scene = scene;

    this.playAnimation('idle');
  }

  move() {
    console.log(this.scene);
  }
}

export default Ben3;
