import * as tf from '@tensorflow/tfjs';
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

    console.log('construct training zone');

    // setTimeout(() => this.sys.game.scene.start('training-zone'), 20000);

    const calculateState = () => {
      const headScale = this.ben?.headScale;

      // @ts-ignore
      const headAngle = this.ben?.head?.body?.angle;

      return [headAngle, headScale, 3.69];
    };

    const calculateReward = (state: number[]) => {
      const [headAngle] = state;
      const reward = 1 - Math.abs(headAngle);
      console.log({ reward });
      return reward;
    };

    const restartScene = () => {
      // note: this must initialise things in random positions
      // this.sys.game.scene.start('training-zone');
      this.scene.pause();
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

  preload() {
    Ben1.preload(this);

    const { preLoad } = parallax(this);
    preLoad();

    Ball.preload(this);
  }

  create() {
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
  }

  update(_time: number, delta: number) {
    if (!this.textbox || !this.ben || !this.ball) return;

    this.textbox.rotation += 0.005 * delta;

    this.ben.update(_time, delta);

    smoothMoveCameraTowards(this, this.ben.head, 0.9);

    // neural network below
    const action = this.run?.();
    this.ben.enactAction(action);
  }
}

export default TrainingZone;
