import * as Phaser from 'phaser';
import { PhaserMatterImage } from '@/types';
import GameScene from '@/scenes/game-scene';
import matterAddImageEllipse from '@/helpers/matterAddImageEllipse';
import Entity, { EntityConfigType } from '@/objects/entities/Entity';
import keepUpright, { KeepUprightStratergies } from '@/helpers/keepUpright';

const KEY = 'ben3';

const HEAD_SCALE_MIN = 0.1;
// const HEAD_SCALE_MAX = 1.5;

const entityConfig: EntityConfigType = {
  name: KEY,
  spriteSheetKey: KEY,
  facing: 1,
  scale: 1,
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
      animationKey: 'walk',
      fps: 5,
      start: 0,
      end: 3,
    },
  ],
};

class Ben3 extends Entity {
  public head: PhaserMatterImage;

  static preload(scene: Phaser.Scene) {
    scene.load.spritesheet({
      key: KEY,
      url: './object/ben3/body-animation.png',
      frameConfig: {
        frameWidth: 75,
        frameHeight: 75,
      },
    });

    scene.load.image('head2', './object/ben2/head2.png');
  }

  constructor(scene: GameScene, x: number, y: number) {
    super(scene, x, y, entityConfig);

    this.scene = scene;

    this.playAnimation('walk');

    this.head = matterAddImageEllipse(scene, 0, 0, 'head2', undefined, {
      width: 340,
      height: 270,
      friction: 0,
    });
    this.head.setScale(HEAD_SCALE_MIN);
    this.add(this.head);

    // now we have this.head and this.gameObject (compound Entity body)
  }

  update() {
    super.update();
    keepUpright(KeepUprightStratergies.SPRINGY, this.gameObject);
    // perhaps use moveTowards to go to goal marker?

    // constantMotion: false,
    // maxSpeedX: 2,
    // maxSpeedY: 8,
  }
}

export default Ben3;
