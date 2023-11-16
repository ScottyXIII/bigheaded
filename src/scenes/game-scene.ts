import * as Phaser from 'phaser';
import toggleDebug from '@/helpers/toggleDebug';
import smoothMoveCameraTowards from '@/helpers/smoothMoveCameraTowards';
import Map from '@/map/Map';
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
      classType: Ben1,
      maxSize: 1,
      runChildUpdate: true,
      autoSpawn: true,
    },
    {
      tiledObjectName: 'item',
      classType: Ball,
      maxSize: 10,
      runChildUpdate: false,
      autoSpawn: true,
    },
  ],
};

class GameScene extends Phaser.Scene {
  private parallax: Parallax | undefined;

  private map: Map | undefined; // map is a reserved class

  private spintext: SpinText | undefined;

  constructor() {
    super('scene-game');
  }

  preload() {
    Parallax.preload(this, parallaxName);
    Map.preload(this, mapConfig);
    Ball.preload(this);
    Ben1.preload(this);
  }

  create() {
    // toggle debug GFX
    // toggleDebug(this);
    this.input.keyboard?.on('keydown-CTRL', () => toggleDebug(this));

    this.matter.add.mouseSpring();

    this.parallax = new Parallax(this, parallaxName);
    this.map = new Map(this, mapConfig);
    this.spintext = new SpinText(this, cx, cy, 'Welcome to Phaser x Vite!');
  }

  update(time: number, delta: number) {
    if (!this.parallax || !this.map || !this.spintext) return;

    this.parallax.update();
    this.spintext.update(time, delta);

    const player =
      this.map.spawners.player.getChildren()[0] as Phaser.Physics.Matter.Image;

    smoothMoveCameraTowards(this, player, 0.9);
  }
}

export default GameScene;
