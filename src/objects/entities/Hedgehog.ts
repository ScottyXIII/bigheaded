import * as Phaser from 'phaser';
import Entity, { EntityConfigType } from '@/objects/entities/Entity';
import keepUpright, { KeepUprightStratergies } from '@/helpers/keepUpright';
import moveTowards from '@/helpers/moveTowards';
import GameScene from '@/scenes/GameScene';
import { CC, CM } from '@/enums/CollisionCategories';

const KEY = 'hedgehog';

const entityConfig: EntityConfigType = {
  name: KEY,
  collisionCategory: CC.enemy,
  collisionMask: CM.enemy,
  spriteSheetKey: KEY,
  facing: -1,
  scale: 2,
  craftpixOffset: {
    x: 0,
    y: -10,
  },
  physicsConfig: {
    width: 70,
    height: 48,
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

  constructor(scene: GameScene, x: number, y: number) {
    super(scene, x, y, entityConfig);

    this.scene = scene;

    this.playAnimation('idle');
  }

  update() {
    super.update();
    keepUpright(KeepUprightStratergies.SPRINGY, this.gameObject);

    if (!this.scene.player) return;
    moveTowards(this, this.scene.player, {
      constantMotion: true,
      maxSpeedX: 1,
      maxSpeedY: 1,
    });
  }
}

export default Hedgehog;
