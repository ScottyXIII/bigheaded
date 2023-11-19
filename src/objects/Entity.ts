import Phaser from 'phaser';
import keepUprightStratergies from '@/objects/Enums/Physics';
import keepUpright from '@/helpers/keepUprightStratergy';

const craftpixOffset = {
  x: 10,
  y: -7,
};

const findOtherBody = (thisSensorId: number, collisionData) => {
  const bodies = [collisionData.bodyA, collisionData.bodyB];
  const other = bodies.find(({id}) => id !== thisSensorId);
  return other;
};

type physicsConfigType = {
  shape: Phaser.Types.Physics.Matter.MatterSetBodyConfig,
  chamfer?: Phaser.Types.Physics.Matter.MatterChamferConfig
  frictionAir?: number,
  bounce?: number,
};

type EntityConfigType = {
  name: string,
  spriteSheetKey: string,
  animations?: object,
  physicsConfig?: physicsConfigType,
  enableKeepUpright?: boolean,
  keepUprightStratergy?: string,
  facing: number,
  scale: number,
  collideCallback?: Function,
};

const defaultConfig = {
  name: 'entity',
  spriteSheetKey: 'player',
  animations: {},
  keepUprightStratergy: keepUprightStratergies.NONE,
  facing: -1,
  scale: 1,
  // eslint-disable-next-line no-unused-vars
  collideCallback: (_sensorName: string, _gameObject: Phaser.GameObjects.Container) => {},
};

class Entity extends Phaser.GameObjects.Container {

  protected keepUprightStratergy;

  protected facing : number;
  
  protected text: Phaser.GameObjects.Text | undefined;

  protected sprite: Phaser.GameObjects.Sprite;

  protected gameObject: Phaser.Physics.Matter.Image | Phaser.Physics.Matter.Sprite | Phaser.GameObjects.GameObject; 

  protected hitbox;

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
    } = {...defaultConfig, ...config};
  
    this.scale = scale;
    this.scene = scene;
    this.name = name;
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
    Object.entries(animations).forEach(([animationKey, { start, end, fps, repeat = -1 }]) => {
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
    // @ts-ignore
    const { Bodies, Body } = Phaser.Physics.Matter.Matter;
    // @ts-ignore
    const { width, height } = physicsConfig.shape;
    this.hitbox = Bodies.rectangle(0, 0, width, height, { ...physicsConfig, label: 'Entity' });
    const left = Bodies.circle(-width/2, 0, 4, { isSensor: true, label: 'left' });
    const right = Bodies.circle(width/2, 0, 4, { isSensor: true, label: 'right' });
    const top = Bodies.circle(0, -height/2, 4, { isSensor: true, label: 'top' });
    const bottom = Bodies.rectangle(0, height/2, width-2,3, { isSensor: true, label: 'bottom' });
    const compoundBody = Body.create({
      parts: [this.hitbox, left, right, top, bottom],
    });

    // when a collsion happens / ends then add / delete the id from the Set
    left.onCollideCallback = data =>  {const other = findOtherBody(left.id, data); this.sensorData.left.add(other.id); collideCallback('left', other); }
    left.onCollideEndCallback = data => this.sensorData.left.delete(findOtherBody(left.id, data).id);
    right.onCollideCallback = data =>  {const other = findOtherBody(right.id, data); this.sensorData.right.add(other.id); collideCallback('right', other); }
    right.onCollideEndCallback = data => this.sensorData.right.delete(findOtherBody(right.id, data).id);
    top.onCollideCallback = data =>  this.sensorData.top.add(findOtherBody(top.id, data).id);
    top.onCollideEndCallback = data => this.sensorData.top.delete(findOtherBody(top.id, data).id);
    bottom.onCollideCallback = data =>  this.sensorData.bottom.add(findOtherBody(bottom.id, data).id);
    bottom.onCollideEndCallback = data => this.sensorData.bottom.delete(findOtherBody(bottom.id, data).id);

    this.gameObject.setExistingBody(compoundBody);
    this.gameObject.setPosition(x, 311);
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
    if (!this.gameObject.body) return;

    this.flipXSprite(this.facing === -1);

    keepUpright(this.keepUprightStratergy, this.gameObject);
  }

}

export default Entity;
