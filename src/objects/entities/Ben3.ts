import * as Phaser from 'phaser';
import { PhaserMatterImage } from '@/types';
import GameScene from '@/scenes/game-scene';
import matterAddImageEllipse from '@/helpers/matterAddImageEllipse';
import Entity, { EntityConfigType } from '@/objects/entities/Entity';
import keepUpright, { KeepUprightStratergies } from '@/helpers/keepUpright';
import moveTowards from '@/helpers/moveTowards';
import { CC, CM } from '@/enums/CollisionCategories';
import HealthBar from '@/overlays/HealthBar';
import prepareCollisionData from '@/helpers/prepareCollisionData';

const KEY = 'bob3';

const HEALTH_MAX = 100;
const HEALTH_MIN = 0;

const HEAD_SCALE_MIN = 0.1;
const HEAD_SCALE_MAX = 1;

const limitNumber = (value: number, min: number, max: number) => {
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

const onCollision = (
  data: Phaser.Types.Physics.Matter.MatterCollisionData,
  // eslint-disable-next-line no-use-before-define
  player: Ben3,
) => {
  const collisionDataObject = prepareCollisionData(data);

  // check if player collide with item
  if (collisionDataObject.item) {
    // check if player collide with coin
    if (collisionDataObject.item[0].gameObject.name === 'coin')
      collisionDataObject.item[0].gameObject.collect();

    // check if player collide with goal
    if (collisionDataObject.item[0].gameObject.name === 'goal')
      player.gameObject.scene.scene.start('win-scene');
  }

  // check if player collide with enemy
  if (collisionDataObject.enemy) {
    const newHealth = player.health - 10;
    player.setHealth(newHealth);
  }
};

const onCollisionHead = (
  data: Phaser.Types.Physics.Matter.MatterCollisionData,
  // eslint-disable-next-line no-use-before-define
  player: Ben3,
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
    x: 0,
    y: 0,
  },
  physicsConfig: {
    width: 75,
    height: 75,
    chamfer: { radius: 30 },
  },
  collisionCategory: CC.player,
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

  protected healthBar: HealthBar;

  public health = HEALTH_MAX;

  public headScale = HEAD_SCALE_MIN;

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
        damping: 0,
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

    if (this.health === 0) this.scene.scene.start('death-scene');
  }

  update(time: number, delta: number) {
    super.update(time, delta);

    if (this.sensorData.bottom.size >= 1) {
      // touching the ground
      keepUpright(KeepUprightStratergies.SPRINGY, this.gameObject, 0.05);

      if (!this.scene.goal) return;
      moveTowards(this, this.scene.goal.skull, {
        constantMotion: true,
        maxSpeedX: 6,
        maxSpeedY: 1,
      });
      this.playAnimation('idle', true);
    } else {
      // airborne
      this.sprite.stop();
    }

    // head scaling stuff
    this.head.setScale(this.headScale);

    // scale pointA position proportionally to headScale
    this.neck.pointA = new Phaser.Math.Vector2(0, this.headScale * 140).rotate(
      this.head.rotation,
    );

    // regenerate health
    this.setHealth(this.health + 0.05);
  }
}

export default Ben3;
