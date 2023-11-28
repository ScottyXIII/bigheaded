import * as Phaser from 'phaser';
import Entity, { EntityConfigType } from '@/objects/entities/Entity';
import keepUpright, { KeepUprightStratergies } from '@/helpers/keepUpright';
import moveTowards from '@/helpers/moveTowards';
import GameScene from '@/scenes/game-scene';
import { CC } from '@/enums/CollisionCategories';

const KEY = 'tomato';

const entityConfig: EntityConfigType = {
  name: KEY,
  collisionCategory: CC.enemy,
  spriteSheetKey: KEY,
  facing: -1,
  scale: 1.5,
  craftpixOffset: {
    x: 0,
    y: -35,
  },
  physicsConfig: {
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

  constructor(scene: GameScene, x: number, y: number) {
    super(scene, x, y, entityConfig);

    this.scene = scene;

    this.playAnimation('movement');
  }

  update() {
    super.update();
    keepUpright(KeepUprightStratergies.SPRINGY, this.gameObject);

    if (!this.scene.player) return;
    moveTowards(this, this.scene.player, {
      constantMotion: false,
      maxSpeedX: 2,
      maxSpeedY: 8,
    });
  }
}

export default Tomato;
