import * as Phaser from 'phaser';
import { PhaserMatterImage } from '@/types';
import GameScene from '@/scenes/GameScene';
import matterAddImageEllipse from '@/helpers/matterAddImageEllipse';
import Entity, { EntityConfigType } from '@/objects/entities/Entity';
import moveTowards from '@/helpers/moveTowards';
import { CC, CM } from '@/enums/CollisionCategories';
import HealthBar from '@/overlays/HealthBar';
import prepareCollisionData from '@/helpers/prepareCollisionData';
import useLocalStorage from '@/helpers/useLocalStorage';

const { getValue: getPurchased } = useLocalStorage('purchased', {
  REGEN: false,
  ARMOR: false,
});

const KEY = 'Bob';

const HEALTH_MAX = 100;
const HEALTH_MIN = 0;

const HEAD_SCALE_MIN = 0.1;
const HEAD_SCALE_MAX = 0.75;

const limitNumber = (value: number, min: number, max: number) => {
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

const onCollision = (
  data: Phaser.Types.Physics.Matter.MatterCollisionData,
  // eslint-disable-next-line no-use-before-define
  player: Bob3,
) => {
  const collisionDataObject = prepareCollisionData(data);

  // check if player collide with item
  if (collisionDataObject.item) {
    // check if player collide with coin
    if (collisionDataObject.item[0].gameObject.name === 'coin')
      collisionDataObject.item[0].gameObject.collect();

    // check if player collide with goal
    if (collisionDataObject.item[0].gameObject.name === 'goal')
      // @ts-expect-error no time!
      player.gameObject.scene.nextScene();
  }

  // check if player collide with enemy
  if (collisionDataObject.enemy) {
    const { ARMOR } = getPurchased();
    const damage = ARMOR ? 5 : 10;
    const newHealth = player.health - damage;
    player.setHealth(newHealth);
  }
};

const onCollisionHead = (
  data: Phaser.Types.Physics.Matter.MatterCollisionData,
  // eslint-disable-next-line no-use-before-define
  player: Bob3,
) => {
  const collisionDataObject = prepareCollisionData(data);

  // check if head collide with ground
  if (collisionDataObject.default) {
    if (collisionDataObject.default[0].gameObject.name === 'staticbody') {
      const newHealth = player.health - 10;
      player.setHealth(newHealth);
    }
  }
};

const entityConfig: EntityConfigType = {
  name: KEY,
  spriteSheetKey: KEY,
  facing: 1,
  scale: 1,
  craftpixOffset: {
    x: -10,
    y: 0,
  },
  physicsConfig: {
    width: 30,
    height: 75,
    chamfer: { radius: 10 },
    friction: 0,
    frictionStatic: 0,
  },
  collisionCategory: CC.player,
  collisionMask: CM.player,
  collideCallback: onCollision,
  animations: [
    {
      animationKey: 'idle',
      fps: 30,
      start: 0,
      end: 29,
    },
  ],
};

class Bob3 extends Entity {
  protected head: PhaserMatterImage;

  protected neck: Phaser.Types.Physics.Matter.MatterConstraintConfig;

  protected healthBar: HealthBar;

  public health = HEALTH_MAX;

  public headScale = HEAD_SCALE_MIN;

  private isJumping = false;

  static preload(scene: Phaser.Scene) {
    scene.load.spritesheet({
      key: KEY,
      url: './object/bob3/run.png',
      frameConfig: {
        frameWidth: 60,
        frameHeight: 85,
      },
    });

    scene.load.image('head2', './object/bob3/head3.png');
  }

  constructor(scene: GameScene, x: number, y: number) {
    super(scene, x, y, entityConfig);
    this.scene = scene;

    this.playAnimation('idle'); // body animation

    this.head = matterAddImageEllipse(scene, x, y, 'head2', undefined, {
      width: 340,
      height: 270,
      collisionCategory: CC.player,
      friction: 0,
    });
    this.head.name = 'bob3head';
    this.head.setScale(HEAD_SCALE_MIN);
    this.head.setCollisionCategory(CC.player);
    this.head.setCollidesWith(CM.player); // set the mask
    this.head.setOnCollide(
      (data: Phaser.Types.Physics.Matter.MatterCollisionData) => {
        onCollision(data, this);
        onCollisionHead(data, this);
      },
    );

    this.neck = scene.matter.add.constraint(
      this.head.body.gameObject,
      this.gameObject.body.gameObject,
      0,
      0.5,
      {
        pointA: { x: 0, y: this.headScale * 140 },
        pointB: { x: 0, y: -75 / 2 - 5 },
        damping: 0.5,
        angularStiffness: 0,
      },
    );

    const { width } = scene.sys.game.canvas;
    const cx = width / 2;
    this.healthBar = new HealthBar(scene, cx, 20, {
      width: 400,
      height: 20,
      padding: 5,
      background: 0x000000,
      maxHealth: 100,
    });
    this.healthBar.bar.setScrollFactor(0, 0);
  }

  jump() {
    if (this.isJumping) return;
    this.isJumping = true;

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

  turnDirection(angularVelocity: number) {
    const { body: Body } = this.scene.matter;

    // Set angular velocity on torso
    Body.setAngularVelocity(this.gameObject.body, angularVelocity);

    // Set angular veloctiy on head so it moves with the body when it gets bigger.
    // If we scale angularVelocity with the head it will just spin uncontrollably.
    Body.setAngularVelocity(this.head.body, angularVelocity);
  }

  setHealth(newHealth: number) {
    this.health = limitNumber(newHealth, HEALTH_MIN, HEALTH_MAX);
    this.healthBar.draw(this.health); // redraw healthbar

    const adjustedScaleMax = HEAD_SCALE_MAX - HEAD_SCALE_MIN;
    const fractionHealth = this.health / HEALTH_MAX;
    const invertedHealth = 1 - fractionHealth;
    const healthScaled = invertedHealth * adjustedScaleMax;
    const newScale = HEAD_SCALE_MIN + healthScaled;

    // if the min = 0.1 and the max = 0.5
    // newHealth fractionHealth invertedHealth newScale
    // 100       1              0              0.1
    // 75        .75            .25            0.2
    // 50        .5             .5             0.3
    // 25        .25            .75            0.4
    // 0         0              1              0.5

    this.headScale = newScale;

    if (this.health === 0) {
      this.scene.scene.pause();
      this.scene.audio?.playAudio('gameover');
      setTimeout(() => {
        this.scene.scene.start('death-scene');
      }, 1_000);
    }
  }

  update(time: number, delta: number) {
    super.update(time, delta);

    if (!this.scene.matter.world.enabled) return; // do nothing if paused

    // rest jump on landing
    if (this.isJumping && this.sensorData.bottom.size >= 1) {
      this.isJumping = false;
    }

    if (this.sensorData.bottom.size >= 1) {
      if (!this.scene.goal) return;
      moveTowards(this, this.scene.goal.skull, {
        constantMotion: true,
        maxSpeedX: 6,
        maxSpeedY: 0.75,
      });
      this.playAnimation('idle');
    } else {
      // airborne
      this.sprite.anims.pause();
    }

    // head scaling stuff
    this.head.setScale(this.headScale);

    // scale pointA position proportionally to headScale
    this.neck.pointA = new Phaser.Math.Vector2(0, this.headScale * 140).rotate(
      this.head.rotation,
    );

    // move name label text into position
    this.text.y = -70 - this.headScale * 260;
    // this.text.text = String(this.sensorData.bottom.size); // debug bottom sensor count

    // regenerate health
    const { REGEN } = getPurchased();
    const healthToGain = REGEN ? 0.07 : 0.02;
    this.setHealth(this.health + healthToGain);

    // apply jump control
    if (this.scene.control?.jump) this.jump();

    // apply balance control
    if (this.scene.control?.balance) {
      this.turnDirection(this.scene.control.balance * 0.02);
    }
  }
}

export default Bob3;
