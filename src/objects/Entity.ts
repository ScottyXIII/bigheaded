import Phaser from 'phaser';
import keepUprightStratergies from '@/objects/Enums/Physics';
import keepUpright from '@/helpers/keepUprightStratergy';

const craftpixOffset = {
  x: 10,
  y: -7,
};

type physicsConfigType = {
  shape: Phaser.Types.Physics.Matter.MatterSetBodyConfig,
  chamfer?: Phaser.Types.Physics.Matter.MatterChamferConfig
  frictionAir?: number,
  bounce?: number,
};

type animationsConfigType = {
  animationKey: string, 
  start: number, 
  end: number, 
  fps: number,
  repeat?: number | undefined
};

type EntityConfigType = {
  name: string,
  spriteSheetKey: string,
  animations?: animationsConfigType[],
  physicsConfig?: physicsConfigType,
  enableKeepUpright?: boolean,
  keepUprightStratergy?: string,
  facing: number,
  scale: number,
  collideCallback?: Function,
  maxSpeedX?: number,
  maxSpeedY?: number,
};

const defaultConfig = {
  name: 'entity',
  spriteSheetKey: 'player',
  animations: [],
  keepUprightStratergy: keepUprightStratergies.NONE,
  facing: -1,
  scale: 1,
  maxSpeedY: 2,
  maxSpeedX: 2,
  // eslint-disable-next-line no-unused-vars
  collideCallback: (_sensorName: string, _gameObject: Phaser.GameObjects.Container) => {
  },
};

class Entity extends Phaser.GameObjects.Container {

  protected keepUprightStratergy;

  protected facing : number;
  
  protected text: Phaser.GameObjects.Text | undefined;

  protected sprite: Phaser.GameObjects.Sprite;

  protected gameObject: Phaser.Physics.Matter.Image | Phaser.Physics.Matter.Sprite | Phaser.GameObjects.GameObject; 

  protected hitbox;

  protected maxSpeedX: number;
 
  protected maxSpeedY: number;

  constructor (scene: Phaser.Scene, x: number, y: number, config: EntityConfigType)
  {
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
      maxSpeedY
    } = {...defaultConfig, ...config};
  
    this.scale = scale;
    this.scene = scene;
    this.name = name;
    this.maxSpeedX = maxSpeedX;
    this.maxSpeedY = maxSpeedY;
    this.keepUprightStratergy = keepUprightStratergy;
    this.facing = facing;

    // text
    this.text = this.scene.add.text(0, 0 - 25, this.name, {
      font: '12px Arial',
      align: 'center',
      color: 'white',
    }).setOrigin(0.5);
    this.add(this.text);

    this.sensorData = {
      left: new Set(),
      right: new Set(),
      top: new Set(),
      bottom: new Set(),
    };

    // sprite
    this.sprite = this.scene.add.sprite(
      craftpixOffset.x,
      craftpixOffset.y,
      this.name,
    ).setScale(scale);
    this.add(this.sprite);


    // animations
    animations.forEach(({animationKey, start, end, fps, repeat = -1 }) => {
      this.scene.anims.create({
        key: this.getKey(animationKey),
        frameRate: fps,
        frames: this.sprite.anims.generateFrameNumbers(spriteSheetKey, { start, end }),
        repeat,
      });
    });

    this.playAnimation("idle");

    // container
    this.gameObject = this.scene.matter.add.gameObject(this);
    this.scene.add.existing(this);
    
    // sensors
    // @ts-ignor
    const { Bodies, Body } = Phaser.Physics.Matter.Matter;
    // @ts-ignore
    const { width, height } = physicsConfig.shape;
    this.hitbox = Bodies.rectangle(0, 0, width, height, { ...physicsConfig, label: 'Entity' });
    const compoundBody = Body.create({
      parts: [this.hitbox],
    });

    this.hitbox.onCollideCallback = data => {collideCallback();}; 

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
      this.sprite.x = -craftpixOffset.x;
    } else {
      this.sprite.x = craftpixOffset.x;
    }
  }

  update() {
    const { player } = this.scene;
    
    if (player) {
      if (player.torso.x > this.x) this.facing = 1;
      if (player.torso.x < this.x) this.facing = -1;
    }

    if (!this.gameObject.body) return;

    this.flipXSprite(this.facing === -1);

    keepUpright(this.keepUprightStratergy, this.gameObject);
  }

}

export default Entity;
