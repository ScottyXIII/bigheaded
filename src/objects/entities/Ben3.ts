import * as Phaser from 'phaser';
import { PhaserMatterImage } from '@/types';
import GameScene from '@/scenes/game-scene';
import matterAddImageEllipse from '@/helpers/matterAddImageEllipse';
import Entity, { EntityConfigType } from '@/objects/entities/Entity';
import keepUpright, { KeepUprightStratergies } from '@/helpers/keepUpright';
import moveTowards from '@/helpers/moveTowards';
import CollisionCategories from '@/enums/CollisionCategories';
import Coin from '@/objects/Coin';

const KEY = 'ben3';

const HEAD_SCALE_MIN = 0.1;
const HEAD_SCALE_MAX = 0.5;

const onCollision = (
  data: MatterJS.ICollisionPair & {
    bodyB: { gameObject: Coin };
  },
) => {
  // check if collide with coin
  if (data.bodyB?.gameObject?.collisionCategory === CollisionCategories.coin) {
    data.bodyB.gameObject.collect();
  }
};

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
    width: 75,
    height: 75,
    chamfer: { radius: 30 },
  },
  collisionCategory: CollisionCategories.player,
  collideCallback: onCollision,
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
  protected head: PhaserMatterImage;

  protected neck: Phaser.Types.Physics.Matter.MatterConstraintConfig;

  public headScale = HEAD_SCALE_MIN;

  private headScaleDirection = 1; // 1 or minus 1

  private leftHalfTouched: boolean = false;

  private rightHalfTouched: boolean = false;

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

    this.playAnimation('idle');

    this.head = matterAddImageEllipse(scene, x, y, 'head2', undefined, {
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

    this.scene.input.on('pointerdown', this.handlePointerDown, this);
    this.scene.input.on('pointerup', this.handlePointerUp, this);

    this.scene.events.on(
      'swipe',
      (swipeDirection: string) => {
        if (swipeDirection === 'up') {
          this.jump();
        }
      },
      this,
    );
  }

  private handlePointerDown(pointer: Phaser.Input.Pointer) {
    const { width } = this.scene.game.config;

    // Check if the initial touch is in the left or right half
    if (pointer.x < width / 2) {
      this.leftHalfTouched = true;
    } else {
      this.rightHalfTouched = true;
    }
  }

  private handlePointerUp() {
    // Reset the flags when the pointer is released
    this.leftHalfTouched = false;
    this.rightHalfTouched = false;
  }

  jump() {
    if (this.sensorData.bottom.size >= 1) {
      this.scene.audio?.playAudio('jump');

      const { body: Body } = this.scene.matter;

      const { centerX, centerY } = this.gameObject.getBounds();
      const position = { x: centerX, y: centerY };
      Body.applyForce(this.gameObject.body, position, {
        x: 0,
        y: -0.05 * this.gameObject.body.mass,
      });

      Body.applyForce(this.head.body, this.head.getCenter(), {
        x: 0,
        y: -0.05 * this.head.body.mass,
      });
    }
  }

  left() {
    this.gameObject.setAngularVelocity((-0.02 * this.head.body.mass) / 2);
  }

  right() {
    this.gameObject.setAngularVelocity((0.02 * this.head.body.mass) / 2);
  }

  update(time: number, delta: number) {
    super.update(time, delta);

    if (this.leftHalfTouched) {
      this.left();
    }

    if (this.rightHalfTouched) {
      this.right();
    }

    if (this.sensorData.bottom.size >= 1) {
      // touching the ground
      // keepUpright(KeepUprightStratergies.SPRINGY, this.gameObject, 0.05);

      if (!this.scene.goal) return;
      moveTowards(this, this.scene.goal.skull, {
        constantMotion: true,
        maxSpeedX: 6,
        maxSpeedY: 1,
      });
      this.playAnimation('idle');
    } else {
      // airborne
      this.sprite.stop();
    }

    // head scaling stuff
    this.head.setScale(this.headScale);
    if (this.headScale > HEAD_SCALE_MAX) this.headScaleDirection = -1;
    if (this.headScale < HEAD_SCALE_MIN) this.headScaleDirection = 1;

    this.headScale += 0.00001 * this.headScaleDirection * delta;

    // this.headScale = HEAD_SCALE_MAX;

    // scale pointA position proportionally to headScale
    this.neck.pointA = new Phaser.Math.Vector2(0, this.headScale * 140).rotate(
      this.head.rotation,
    );
  }
}

export default Ben3;
