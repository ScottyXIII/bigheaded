import * as Phaser from 'phaser';
import toggleDebug from '@/helpers/toggleDebug';
import smoothMoveCameraTowards from '@/helpers/smoothMoveCameraTowards';
import Level from '@/map/Level';
import Parallax, { ParallaxNames } from '@/objects/Parallax';
import SpinText from '@/objects/SpinText';
import Ball from '@/objects/Ball';
import Ben1 from '@/characters/Ben1';

const cx = window.innerWidth / 2;
const cy = window.innerHeight / 2;

const parallaxName: ParallaxNames = 'supermountaindusk';

const mapConfig = {
  // parallaxName: 'supermountaindusk',
  tilesetPng: 'level/map/tileset1.png',
  tiledMapJson: 'level/map/mapData1.json',
  tileWidth: 32,
  tileHeight: 32,
  tileMargin: 0,
  tileSpacing: 0,
  layerConfig: [
    { tiledLayerName: 'background', depth: 0, collisionCategory: undefined },
    { tiledLayerName: 'solidground', depth: 10, collisionCategory: 0b101 },
    { tiledLayerName: 'foreground', depth: 20, collisionCategory: undefined },
  ],
  spawnerConfig: [
    {
      tiledObjectName: 'player',
      classFactory: Ben1,
      maxSize: 1,
      runChildUpdate: true,
      autoSpawn: true,
    },
    {
      tiledObjectName: 'item',
      classFactory: Ball,
      maxSize: 10,
      runChildUpdate: false,
      autoSpawn: true,
    },
    {
      tiledObjectName: 'spin',
      classFactory: SpinText,
      maxSize: 1,
      runChildUpdate: true,
      autoSpawn: true,
    },
  ],
};

class GameScene extends Phaser.Scene {
  private parallax: Parallax | undefined;

  private map: Level | undefined;

  private spintext: SpinText | undefined;

  constructor() {
    super('scene-game');
  }

  preload() {
    Parallax.preload(this, parallaxName);
    Level.preload(this, mapConfig);
  }

  create() {
    // toggle debug GFX
    // toggleDebug(this);
    this.input.keyboard?.on('keydown-CTRL', () => toggleDebug(this));

    this.matter.add.mouseSpring();

    this.parallax = new Parallax(this, parallaxName);
    this.map = new Level(this, mapConfig);
    this.spintext = new SpinText(this, cx, cy);
  }

  update(time: number, delta: number) {
    if (!this.parallax || !this.map || !this.spintext) return;

    this.parallax.update();
    this.spintext.update(time, delta);

    const player = this.map.spawners.player.getChildren()[0] as Ben1;

    smoothMoveCameraTowards(this, player.head, 0.9);
  }
}

export default GameScene;
