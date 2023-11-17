import * as Phaser from 'phaser';
import toggleDebug from '@/helpers/toggleDebug';
import smoothMoveCameraTowards from '@/helpers/smoothMoveCameraTowards';
import toggleMusic from '@/helpers/toggleMusic';
import Parallax, { ParallaxNames } from '@/objects/Parallax';
import Level from '@/objects/Level';
import SpinText from '@/objects/SpinText';
import Ben1 from '@/objects/Ben1';
import Ball from '@/objects/Ball';
import Audio from '@/objects/Audio';

const parallaxName: ParallaxNames = 'supermountaindusk';

const levelConfig = {
  tilesetPng: './level/tileset/tileset1.png',
  tiledMapJson: './level/tiled-level/mapData1.json',
  tileWidth: 32,
  tileHeight: 32,
  tileMargin: 0,
  tileSpacing: 0,
  layerConfig: [
    { tiledLayerName: 'background', depth: 0 },
    { tiledLayerName: 'solidground', depth: 10 },
    { tiledLayerName: 'foreground', depth: 20 },
  ],
  spawnerConfig: [
    {
      tiledObjectName: 'spin',
      classFactory: SpinText,
      maxSize: 1,
      runChildUpdate: true,
      autoSpawn: true,
    },
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
  ],
};

const soundConfig = [
  {
    key: 'punch',
    filePath: './audio/sfx/punch.wav',
    loop: false,
  },
  {
    key: 'music1',
    filePath: './audio/music/fluffing-a-duck.mp3',
    loop: true,
  },
  {
    key: 'music2',
    filePath: './audio/music/sneaky-snitch.mp3',
    loop: true,
  },
  {
    key: 'music3',
    filePath: './audio/music/spook.mp3',
    loop: true,
  },
];

class GameScene extends Phaser.Scene {
  private parallax: Parallax | undefined;

  private level: Level | undefined;

  private audio: Audio | undefined;

  constructor() {
    super('scene-game');
  }

  preload() {
    Parallax.preload(this, parallaxName);
    Level.preload(this, levelConfig);
    Audio.preload(this, soundConfig);
  }

  create() {
    // toggle debug GFX
    // toggleDebug(this);
    this.input.keyboard?.on('keydown-CTRL', () => toggleDebug(this));
    this.matter.add.mouseSpring();

    this.parallax = new Parallax(this, parallaxName);
    this.level = new Level(this, levelConfig);
    this.audio = new Audio(this, soundConfig);

    this.audio.playAudio('music2');
    toggleMusic(this);
  }

  update() {
    if (!this.parallax || !this.level) return;

    this.parallax.update();

    const player = this.level.spawners.player.getChildren()[0] as Ben1;
    smoothMoveCameraTowards(this, player.torso, 0.9);
  }
}

export default GameScene;
