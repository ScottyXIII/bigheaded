import * as Phaser from 'phaser';
import { PhaserMatterImage } from '@/types';
import GameScene from '@/scenes/game-scene';
import matterAddImageEllipse from '@/helpers/matterAddImageEllipse';
import Entity, { EntityConfigType } from '@/objects/entities/Entity';
import keepUpright, { KeepUprightStratergies } from '@/helpers/keepUpright';
import moveTowards from '@/helpers/moveTowards';

const KEY = 'ben3';

const HEAD_SCALE_MIN = 0.1;
const HEAD_SCALE_MAX = 0.5;

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
  protected head: PhaserMatterImage;

  protected neck: Phaser.Types.Physics.Matter.MatterConstraintConfig;

  public headScale = HEAD_SCALE_MIN;

  private headScaleDirection = 1; // 1 or minus 1

  static preload(scene: Phaser.Scene) {
    scene.load.spritesheet({
      key: KEY,
      url: './object/ben3/body-animation.png',
      frameConfig: {
        frameWidth: 75,
        frameHeight: 75,
      },
    });

    scene.load.image('head2', './object/ben3/head3.png');
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

    this.neck = scene.matter.add.constraint(
      this.head.body.gameObject,
      this.gameObject.body.gameObject,
      0,
      0.5,
      {
        pointA: { x: 0, y: this.headScale * 140 },
        pointB: { x: 0, y: -75 / 2 - 5 },
        damping: 0,
        angularStiffness: 0,
      },
    );
  }

  jump() {
    if (this.sensorData.bottom.size >= 1) {
      // @ts-expect-error todo
      this.gameObject.applyForce({ x: 0, y: -0.3 });
      // @ts-expect-error todo
      this.head.applyForce({ x: 0, y: -0.3 });
    }
  }

  update(time: number, delta: number) {
    super.update(time, delta);

    if (this.sensorData.bottom.size >= 1) {
      // touching the ground
      keepUpright(KeepUprightStratergies.SPRINGY, this.gameObject, 0.05);
      moveTowards(
        this,
        { x: 40000, y: 500 },
        {
          constantMotion: true,
          maxSpeedX: 12,
          maxSpeedY: 8,
        },
      );
      this.playAnimation('walk');
    } else {
      // airborne
      this.sprite.stop();
    }

    // head scaling stuff
    this.head.setScale(this.headScale);
    if (this.headScale > HEAD_SCALE_MAX) this.headScaleDirection = -1;
    if (this.headScale < HEAD_SCALE_MIN) this.headScaleDirection = 1;

    this.headScale += 0.00001 * this.headScaleDirection * delta;

    // scale pointA position proportionally to headScale
    this.neck.pointA = new Phaser.Math.Vector2(0, this.headScale * 140).rotate(
      this.head.rotation,
    );
  }
}

export default Ben3;
