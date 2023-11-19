import * as Phaser from 'phaser';
import Entity from '@/objects/Entity';
import keepUprightStratergies from '@/objects/Enums/Physics';

const KEY = 'hedgehog';

const entityConfig = {
  name: 'hedgehog',
  spriteSheetKey: 'hedgehog',
  keepUprightStratergy: keepUprightStratergies.INSTANT,
  facing: -1,
  scale: 2.5,
  physicsConfig: {
    bounce: 1,
    shape: {
      type: 'rectangle',
      width: 125, 
      height: 50 
    }
  },
  collideCallback: () => {},
};

class Hedgehog extends Entity {
  static preload(scene: Phaser.Scene) {
    scene.load.spritesheet({
      key: KEY,
      url: './object/enemies/hedgehog.png',
      frameConfig: {
        frameWidth: 24,
        frameHeight: 24,
        startFrame: 0,
        endFrame: 18
      }
    });
  }

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(
      scene, 
      x, 
      y,
      entityConfig
    );

    this.scene = scene;
    
    this.sprite = this.scene.add.sprite(
      x,
      y,
      this.name,
    ).setScale(11);
    
    this.scene.anims.create({
      key: 'sleeping',
      frameRate: 3,
      frames: this.scene.anims.generateFrameNumbers(KEY, { frames: [ 12, 13, 14, 15 ] }),
      repeat: -1
    });
    this.sprite.play("sleeping");
  }

  update(_time: number, delta: number) {
    super.update();
  }
}

export default Hedgehog;
