import * as Phaser from 'phaser';

import toggleDebug from '@/helpers/toggleDebug';
import smoothMoveCameraTowards from '@/helpers/smoothMoveCameraTowards';
import toggleMusic from '@/helpers/toggleMusic';
import useLocalStorage from '@/helpers/useLocalStorage';
import isDev from '@/helpers/isDev';

import Parallax, { ParallaxNames } from '@/objects/Parallax';
import Level from '@/objects/Level';
import SpinText from '@/objects/SpinText';
import Ben2 from '@/objects/Ben2';
import Ball from '@/objects/Ball';
import Audio from '@/objects/Audio';

const parallaxName: ParallaxNames = 'supermountaindusk';

const levelConfig = {
  tilesetPng: './level/tileset/tileset1.png',
  tiledMapJson: './level/tiled-level/test-flat.json',
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
      classFactory: Ben2,
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
    if (isDev) this.input.keyboard?.on('keydown-CTRL', () => toggleDebug(this));

    this.matter.add.mouseSpring();

    this.parallax = new Parallax(this, parallaxName);
    this.level = new Level(this, levelConfig);
    this.audio = new Audio(this, soundConfig);

    this.audio.playAudio('music2');
    toggleMusic(this); // attaches listener to mute button
    const [isMute] = useLocalStorage('isMute', false);
    this.game.sound.mute = isMute; // set game mute to saved ls value
  }

  update() {
    if (!this.parallax || !this.level) return;

    this.parallax.update();

    const player = this.level.spawners.player.getChildren()[0] as Ben2;
    player.enactAction(1);
    smoothMoveCameraTowards(this, player.head, 0.8);

    const [myNum, setMyNum] = useLocalStorage('testNum', 0);
    setMyNum(myNum + 1);
  }
}

export default GameScene;
