import Entity, { EntityConfigType } from '@/objects/entities/Entity';
import GameScene from '@/scenes/GameScene';
import { CC, CM } from '@/enums/CollisionCategories';

const KEY = 'coin';

const entityConfig: EntityConfigType = {
  name: KEY,
  collisionCategory: CC.item,
  collisionMask: CM.item,
  spriteSheetKey: KEY,
  facing: 1,
  scale: 1,
  craftpixOffset: {
    x: 0,
    y: 0,
  },
  physicsConfig: {
    width: 15,
    height: 15,
    chamfer: { radius: 5 },
  },
  animations: [
    {
      animationKey: 'idle',
      fps: 12,
      start: 0,
      end: 4,
      repeat: -1,
    },
  ],
};

class Coin extends Entity {
  public coin: Phaser.GameObjects.Image | undefined;

  static preload(scene: Phaser.Scene) {
    scene.load.spritesheet({
      key: KEY,
      url: './object/items/coins.png',
      frameConfig: {
        frameWidth: 16,
        frameHeight: 16,
      },
    });
  }

  constructor(scene: GameScene, x: number, y: number) {
    super(scene, x, y, entityConfig);
    this.scene = scene;
    this.playAnimation('idle');
  }

  collect() {
    this.scene.audio?.playAudio('coin');
    this.scene.collectCoin();
    this.destroy();
  }
}

export default Coin;
