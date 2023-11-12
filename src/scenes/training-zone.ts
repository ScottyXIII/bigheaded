import * as Phaser from 'phaser';
import toggleDebug from '@/helpers/toggleDebug';
import smoothMoveCameraTowards from '@/helpers/smoothMoveCameraTowards';
import Parallax, { ParallaxNames } from '@/objects/Parallax';
import SpinText from '@/objects/SpinText';
import Ball from '@/objects/Ball';
import Ben1 from '@/characters/ben1/Ben';
import createOrchestrator from '@/ai/reinforcement-learning/create-orchestrator';

const cx = window.innerWidth / 2;
const cy = window.innerHeight / 2;

const parallaxName: ParallaxNames = 'blueforest';

class TrainingZone extends Phaser.Scene {
  private parallax: Parallax | undefined;

  public ben: Ben1 | undefined;

  private spintext: SpinText | undefined;

  // private ball: Ball | undefined;

  private run: Function | undefined;

  private replay: Function | undefined;

  preload() {
    Parallax.preload(this, parallaxName);
    Ben1.preload(this);
    Ball.preload(this);
  }

  constructor() {
    super('training-zone');

    // console.log('construct training zone');

    // setTimeout(() => this.sys.game.scene.start('training-zone'), 20000);

    const calculateState = () => {
      const headScale = this.ben?.headScale;

      // @ts-ignore
      const headAngle = this.ben?.head?.body?.angle;

      return [headAngle, headScale, 3.69];
    };

    const calculateReward = (state: number[]) => {
      const [headAngle] = state;
      // const reward = 1 - Math.abs(headAngle);
      // return reward;
      if (Math.abs(headAngle) < 0.1) return 1;
      if (Math.abs(headAngle) < 0.2) return 0.5;
      return 0;
    };

    const restartScene = () => {
      // note: this must initialise things in random positions
      this.sys.game.scene.start('training-zone');
      // this.scene.pause();
      this.replay?.();
    };

    (async () => {
      const { run, replay } = await createOrchestrator(
        calculateState,
        calculateReward,
        restartScene,
      );

      this.run = run;
      this.replay = replay;
    })();
  }

  create() {
    // toggle debug GFX
    // toggleDebug(this);
    this.input.keyboard?.on('keydown-CTRL', () => toggleDebug(this));

    this.matter.world.setBounds();
    this.matter.add.mouseSpring();

    this.parallax = new Parallax(this, parallaxName);

    this.ben = new Ben1(this, cx, cy);

    this.spintext = new SpinText(this, cx, cy, 'Training Zone!');

    // this.ball = new Ball(this, cx, cy);
    // this.ball = new Ball(this, cx, cy);
  }

  update(time: number, delta: number) {
    if (!this.parallax || !this.spintext || !this.ben) return;

    this.parallax.update();
    this.spintext.update(time, delta);
    this.ben.update(time, delta);

    smoothMoveCameraTowards(this, this.ben.head, 0.9);

    // neural network below
    const action = this.run?.();
    this.ben.enactAction(action);
  }
}

export default TrainingZone;
