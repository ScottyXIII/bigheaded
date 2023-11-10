import * as Phaser from 'phaser';
import { Scene, GameObjects } from 'phaser';
import toggleDebug from '@/helpers/toggleDebug';
import smoothMoveCameraTowards from '@/helpers/smoothMoveCameraTowards';
import parallax from '@/objects/parallax';
import Ball from '@/objects/ball';
import Ben1 from '@/characters/ben1/Ben';
import createOrchestrator from '@/ai/reinforcement-learning/create-orchestrator';

const cx = window.innerWidth / 2;
const cy = window.innerHeight / 2;

class TrainingZone extends Scene {
  public ben: Ben1 | undefined;

  private textbox: GameObjects.Text | undefined;

  private ball: Ball | undefined;

  private run: Function | undefined;

  private replay: Function | undefined;

  constructor() {
    super('training-zone');
  }

  preload() {
    Ben1.preload(this);

    const { preLoad } = parallax(this);
    preLoad();

    Ball.preload(this);
  }

  async create() {
    // toggle debug GFX
    // toggleDebug(this);
    this.input.keyboard?.on('keydown-CTRL', () => toggleDebug(this));

    this.matter.world.setBounds();
    this.matter.add.mouseSpring();

    const { create } = parallax(this);
    create();

    this.ben = new Ben1(this, cx, cy);

    this.textbox = this.add
      .text(cx, cy, 'Training Zone!', {
        color: '#FFF',
        fontFamily: 'monospace',
        fontSize: '26px',
      })
      .setOrigin(0.5, 0.5);

    this.ball = new Ball(this, cx, cy);
    this.ball = new Ball(this, cx, cy);

    console.log('create training zone');

    // setTimeout(() => this.sys.game.scene.start('training-zone'), 20000);

    const calculateState = () => {
      // eslint-disable-next-line no-console
      console.log(this.ben?.body?.position);
      // what the nn needs to know
      // headsize
      // isTouchingGround
      // headAngle
    };

    const calculateReward = () => {
      //   if (position >= 0.5) {
      //     return 100;
      //   }
      //   if (position >= 0.25) {
      //     return 20;
      //   }
      //   if (position >= 0.1) {
      //     return 10;q
      //   }
      //   if (position >= 0) {
      //     return 5;
      //   }
      //   return 0;
    };

    const restartScene = () => {
      console.log('restartScene');
      // note: this must initialise things in random positions
      // this.sys.game.scene.stop('game-scene');
      this.sys.game.scene.start('training-zone');
    };

    const { run, replay } = await createOrchestrator(
      this,
      calculateState,
      calculateReward,
      restartScene,
    );

    this.run = run;
    this.replay = replay;
  }

  update(_time: number, delta: number) {
    if (!this.textbox || !this.ben || !this.ball) return;

    this.textbox.rotation += 0.005 * delta;

    this.ben.update(_time, delta);

    smoothMoveCameraTowards(this, this.ben.head, 0.9);

    // neural network below

    const action = this.run?.(1, 2);
    // const head = this.ben?.head?.body as Phaser.Types.Physics.Matter.MatterBody;

    // @ts-ignore
    // console.log(head?.angle);

    const xyForce = { x: action / 5, y: 0 };
    // @ts-ignore
    Phaser.Physics.Matter.Matter.Body.applyForce(
      this.ben.torso?.body,
      this.ben.torso?.getCenter(),
      xyForce,
    );
  }
}

export default TrainingZone;
