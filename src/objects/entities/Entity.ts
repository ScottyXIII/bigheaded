import Phaser from 'phaser';
import keepUpright from '@/helpers/keepUprightStratergy';
import KeepUprightStratergies from '@/objects/Enums/KeepUprightStratergies';

type AnimationsConfigType = {
  animationKey: string;
  start: number;
  end: number;
  fps: number;
  repeat?: number | undefined;
};

type EntityConfigType = {
  name: string;
  spriteSheetKey: string;
  animations: AnimationsConfigType[];
  physicsConfig?: Phaser.Types.Physics.Matter.MatterSetBodyConfig;
  keepUprightStratergy: KeepUprightStratergies;
  facing: number;
  scale: number;
  collideCallback?: Function;
  maxSpeedX: number;
  maxSpeedY: number;
  craftpixOffset?: {
    x: number;
    y: number;
  };
  constantMotion?: boolean;
};

const defaultConfig = {
  name: 'entity',
  spriteSheetKey: 'player',
  animations: [],
  keepUprightStratergy: KeepUprightStratergies.NONE,
  facing: -1,
  scale: 1,
  maxSpeedY: 2,
  maxSpeedX: 2,
  constantMotion: false,
  craftpixOffset: {
    x: 0,
    y: 0,
  },
  collideCallback: (
    _sensorName: string, // eslint-disable-line no-unused-vars
    _gameObject: Phaser.GameObjects.Container, // eslint-disable-line no-unused-vars
  ) => {},
};

class Entity extends Phaser.GameObjects.Container {
  protected keepUprightStratergy;

  protected facing: number;

  protected text: Phaser.GameObjects.Text | undefined;

  protected sprite: Phaser.GameObjects.Sprite;

  protected gameObject: Phaser.Physics.Matter.Image;

  protected hitbox;

  protected maxSpeedX: number;

  protected maxSpeedY: number;

  protected target: Phaser.GameObjects.Container | undefined;

  protected craftpixOffset: {
    x: number;
    y: number;
  };

  protected constantMotion: boolean;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    config: EntityConfigType,
  ) {
    super(scene, x, y);

    const {
      name,
      spriteSheetKey,
      animations,
      physicsConfig,
      keepUprightStratergy,
      facing,
      scale,
      collideCallback,
      maxSpeedX,
      maxSpeedY,
      constantMotion,
      craftpixOffset,
    } = { ...defaultConfig, ...config };

    this.scale = scale;
    this.scene = scene;
    this.name = name;
    this.maxSpeedX = maxSpeedX;
    this.maxSpeedY = maxSpeedY;
    this.craftpixOffset = craftpixOffset;
    this.constantMotion = constantMotion;
    this.keepUprightStratergy = keepUprightStratergy;
    this.facing = facing;

    // text
    this.text = this.scene.add
      .text(0, 0 - 25, this.name, {
        font: '12px Arial',
        align: 'center',
        color: 'white',
      })
      .setOrigin(0.5);
    this.add(this.text);

    // sprite
    this.sprite = this.scene.add
      .sprite(this.craftpixOffset.x, this.craftpixOffset.y, this.name)
      .setScale(scale);
    this.add(this.sprite);

    // animations
    animations.forEach(({ animationKey, start, end, fps, repeat = -1 }) => {
      this.scene.anims.create({
        key: this.getKey(animationKey),
        frameRate: fps,
        frames: this.sprite.anims.generateFrameNumbers(spriteSheetKey, {
          start,
          end,
        }),
        repeat,
      });
    });
    this.playAnimation('idle');

    // container
    this.gameObject = this.scene.matter.add.gameObject(
      this,
    ) as Phaser.Physics.Matter.Image;
    this.scene.add.existing(this);

    // sensors
    const { bodies: Bodies, body: Body } = scene.matter;
    // @ts-ignore
    const { width, height } = physicsConfig;
    this.hitbox = Bodies.rectangle(0, 0, width, height, physicsConfig);
    const compoundBody = Body.create({
      parts: [this.hitbox],
    });

    // @ts-ignore
    this.hitbox.onCollideCallback = data => {
      collideCallback(data);
    }; // Do we want left/right/top/down sensors like the last game?
    this.gameObject.setExistingBody(compoundBody);
    this.gameObject.setPosition(x, y);
    this.sprite.setScale(this.scale);
  }

  getKey(key: string) {
    return `${this.name}_${key}`;
  }

  playAnimation(key: string, ignoreIfPlaying = true) {
    return this.sprite.play(this.getKey(key), ignoreIfPlaying);
  }

  flipXSprite(shouldFlip: boolean) {
    this.sprite.flipX = shouldFlip;
    if (shouldFlip) {
      this.sprite.x = -this.craftpixOffset.x;
    } else {
      this.sprite.x = this.craftpixOffset.x;
    }
  }

  update() {
    if (!this.gameObject.body) return;
    if (this.gameObject.body instanceof Phaser.Physics.Arcade.Body) return;
    if (this.gameObject.body instanceof Phaser.Physics.Arcade.StaticBody)
      return;

    this.flipXSprite(this.facing === -1);

    keepUpright(this.keepUprightStratergy, this.gameObject);
    // @ts-ignore
    const { angularVelocity } = this.gameObject.body;
    const speed = Math.hypot(
      this.gameObject.body.velocity.x,
      this.gameObject.body.velocity.y,
    );
    const motion = speed + Math.abs(angularVelocity);
    const closeToStationary = motion <= 0.1;

    // @ts-ignore
    const { player } = this.scene;

    if (player === undefined) {
      return;
    }

    if (player.torso.x > this.x) this.facing = 1;
    if (player.torso.x < this.x) this.facing = -1;

    if (closeToStationary || this.constantMotion) {
      const vectorTowardsPlayer = {
        x: player.torso.x - this.x,
        y: player.torso.y - this.y,
      };
      this.gameObject.setVelocity?.(
        vectorTowardsPlayer.x < 0 ? -this.maxSpeedX : this.maxSpeedX,
        vectorTowardsPlayer.y < 0 ? -this.maxSpeedY : this.maxSpeedY,
      );
    }
  }
}

export default Entity;
