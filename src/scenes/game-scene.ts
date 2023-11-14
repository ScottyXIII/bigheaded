import * as Phaser from 'phaser';
import toggleDebug from '@/helpers/toggleDebug';
import smoothMoveCameraTowards from '@/helpers/smoothMoveCameraTowards';
import Parallax, { ParallaxNames } from '@/objects/Parallax';
import SpinText from '@/objects/SpinText';
import Ball from '@/objects/Ball';
import Ben1 from '@/characters/Ben1';

const cx = window.innerWidth / 2;
const cy = window.innerHeight / 2;

const parallaxName: ParallaxNames = 'supermountaindusk';

class GameScene extends Phaser.Scene {
  private parallax: Parallax | undefined;

  private spintext: SpinText | undefined;

  private ball: Ball | undefined;

  private ben: Ben1 | undefined;

  constructor() {
    super('scene-game');
  }

  preload() {
    Parallax.preload(this, parallaxName);
    Ball.preload(this);
    Ben1.preload(this);
  }

  create() {
    // toggle debug GFX
    // toggleDebug(this);
    this.input.keyboard?.on('keydown-CTRL', () => toggleDebug(this));

    this.matter.world.setBounds();
    this.matter.add.mouseSpring();

    this.parallax = new Parallax(this, parallaxName);
    this.spintext = new SpinText(this, cx, cy, 'Welcome to Phaser x Vite!');
    this.ball = new Ball(this, cx, cy);
    this.ben = new Ben1(this, cx, cy);
  }

  update(time: number, delta: number) {
    if (!this.parallax || !this.spintext || !this.ball || !this.ben) return;

    this.parallax.update();
    this.spintext.update(time, delta);

    smoothMoveCameraTowards(this, this.ben.torso, 0.9);
  }
}

export default GameScene;
