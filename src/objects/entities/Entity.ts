import Phaser from 'phaser';
import { PhaserMatterImage } from '@/types';

type AnimationsConfigType = {
  animationKey: string;
  start: number;
  end: number;
  fps: number;
  repeat?: number | undefined;
};

export type EntityConfigType = {
  name: string;
  spriteSheetKey: string;
  animations: AnimationsConfigType[];
  physicsConfig?: MatterJS.IChamferableBodyDefinition & {
    width: number;
    height: number;
  };
  facing: number;
  scale: number;
  // eslint-disable-next-line @typescript-eslint/ban-types
  collideCallback?: Function;
  maxSpeedX: number;
  maxSpeedY: number;
  craftpixOffset: {
    x: number;
    y: number;
  };
  constantMotion: boolean;
};

const defaultConfig: EntityConfigType = {
  name: 'entity',
  spriteSheetKey: 'player',
  animations: [],
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
    _sensorName: string, // eslint-disable-line @typescript-eslint/no-unused-vars
    _gameObject: Phaser.GameObjects.Container, // eslint-disable-line @typescript-eslint/no-unused-vars
  ) => {},
};

class Entity extends Phaser.GameObjects.Container {
  protected facing: number;

  protected text: Phaser.GameObjects.Text | undefined;

  protected sprite: Phaser.GameObjects.Sprite;

  public gameObject: PhaserMatterImage;

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
    ) as PhaserMatterImage;
    this.scene.add.existing(this);

    // sensors
    const { bodies: Bodies, body: Body } = scene.matter;
    // @ts-expect-error todo
    const { width, height } = physicsConfig;
    this.hitbox = Bodies.rectangle(0, 0, width, height, physicsConfig);
    const compoundBody = Body.create({
      parts: [this.hitbox],
    });

    // @ts-expect-error todo
    this.hitbox.onCollideCallback = data => {
      collideCallback?.(data);
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(_time: number, _delta: number) {
    this.flipXSprite(this.facing === -1);

    // @ts-expect-error todo
    // ToDo: abstract player out and pass pos in via moveTowards func.
    const { player } = this.scene;
    if (player !== undefined) {
      this.moveTowards(player.torso.x, player.torso.y);
    }
  }
}

export default Entity;
