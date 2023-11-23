import * as Phaser from 'phaser';

import toggleDebug from '@/helpers/toggleDebug';
import smoothMoveCameraTowards from '@/helpers/smoothMoveCameraTowards';
import toggleMusic from '@/helpers/toggleMusic';
import useLocalStorage from '@/helpers/useLocalStorage';
import isDev from '@/helpers/isDev';

import Parallax, { ParallaxNames } from '@/objects/Parallax';
import Level, { LevelConfigType } from '@/objects/Level';

import Ben3 from '@/objects/entities/Ben3';
import Bat from '@/objects/entities/Bat';
import Tomato from '@/objects/entities/Tomato';
import Hedgehog from '@/objects/entities/Hedgehog';

import Ball from '@/objects/Ball';
import Skull from '@/objects/Skull';

import Audio from '@/objects/Audio';

const parallaxName: ParallaxNames = 'supermountaindusk';

const levelConfig: LevelConfigType = {
  tilesetPng: './level/tileset/demo-tileset.png',
  tiledMapJson: './level/tiled-level/test-bumpy.json',
  // tiledMapJson: './level/tiled-level/test-flat.json',

  // tilesetPng: './level/tileset/tileset1.png',
  // tiledMapJson: './level/tiled-level/mapData1.json',

  tileWidth: 32,
  tileHeight: 32,
  tileMargin: 0,
  tileSpacing: 0,
  layerConfig: [
    // { tiledLayerName: 'background', depth: 0 },
    { tiledLayerName: 'solidground', depth: 10 },
    // { tiledLayerName: 'foreground', depth: 20 },
  ],
  spawnerConfig: [
    {
      tiledObjectName: 'player',
      classFactory: Ben3,
      maxSize: 1,
      runChildUpdate: true,
      autoSpawn: true,
    },
    {
      tiledObjectName: 'goal',
      classFactory: Skull,
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
      tiledObjectName: 'hedgehog',
      classFactory: Hedgehog,
      maxSize: 10,
      runChildUpdate: true,
      autoSpawn: true,
    },
    {
      tiledObjectName: 'bat',
      classFactory: Bat,
      maxSize: 10,
      runChildUpdate: true,
      autoSpawn: true,
    },
    {
      tiledObjectName: 'tomato',
      classFactory: Tomato,
      maxSize: 10,
      runChildUpdate: true,
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

  public player: Ben3 | undefined;

  public goal: Skull | undefined;

  constructor() {
    super('scene-game');
  }

  preload() {
    Parallax.preload(this, parallaxName);
    Level.preload(this, levelConfig);
    Audio.preload(this, soundConfig);
    Hedgehog.preload(this);
  }

  create() {
    // @ts-expect-error nope
    window.killSpinner();

    // toggle debug GFX
    if (isDev) this.input.keyboard?.on('keydown-CTRL', () => toggleDebug(this));

    this.matter.add.mouseSpring();

    this.parallax = new Parallax(this, parallaxName);
    this.level = new Level(this, levelConfig);
    this.audio = new Audio(this, soundConfig);

    this.audio.playAudio('music2');
    toggleMusic(this); // attaches listener to mute button
    const [isMute] = useLocalStorage('isMute', false);
    this.game.sound.mute = isMute; // set game mute to saved ls value

    this.player = this.level.spawners.player.getChildren()[0] as Ben3;
    this.goal = this.level.spawners.goal.getChildren()[0] as Skull;

    // keyboard controls
    const spaceKey = this.input.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );
    spaceKey?.on('down', this.jump.bind(this));

    // touch tap mobile and mouse leftclick controls
    this.input.on('pointerdown', this.jump.bind(this));
  }

  jump() {
    if (!this.level || !this.player) return;
    this.player.jump();
  }

  update() {
    if (!this.parallax || !this.level || !this.player) return;

    this.parallax.update();

    smoothMoveCameraTowards(this, this.player.gameObject, 0.8);

    const [myNum, setMyNum] = useLocalStorage('testNum', 0);
    setMyNum(myNum + 1);
  }
}

export default GameScene;
