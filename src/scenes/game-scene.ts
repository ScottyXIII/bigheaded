import * as Phaser from 'phaser';

import toggleDebug from '@/helpers/toggleDebug';
import smoothMoveCameraTowards from '@/helpers/smoothMoveCameraTowards';
import useLocalStorage from '@/helpers/useLocalStorage';
import isDev from '@/helpers/isDev';
import settingsMenu from '@/helpers/settingsMenu';

import Parallax, { ParallaxNames } from '@/objects/Parallax';
import Level, { LevelConfigType } from '@/objects/Level';

import Ben3 from '@/objects/entities/Ben3';
import Bat from '@/objects/entities/Bat';
import Tomato from '@/objects/entities/Tomato';
import Hedgehog from '@/objects/entities/Hedgehog';
import Coin from '@/objects/entities/Coin';

import Skull from '@/objects/Skull';

import Audio from '@/objects/Audio';
import Text from '@/objects/Text';
import CoinHud from '@/overlays/CoinHud';

const parallaxName: ParallaxNames = 'supermountaindusk';

const levelConfig: LevelConfigType = {
  tilesetPng: './level/tileset/sd-tileset64a.png',
  tiledMapJson: './level/tiled-level/test-64c.json',
  tileWidth: 64,
  tileHeight: 64,
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
      tiledObjectName: 'hedgehog',
      classFactory: Hedgehog,
      maxSize: 100,
      runChildUpdate: true,
      autoSpawn: true,
    },
    {
      tiledObjectName: 'bat',
      classFactory: Bat,
      maxSize: 100,
      runChildUpdate: true,
      autoSpawn: true,
    },
    {
      tiledObjectName: 'tomato',
      classFactory: Tomato,
      maxSize: 100,
      runChildUpdate: true,
      autoSpawn: true,
    },
    {
      tiledObjectName: 'coin',
      classFactory: Coin,
      maxSize: 1000,
      runChildUpdate: true,
      autoSpawn: true,
    },
  ],
};

const soundConfig = [
  {
    key: 'music1',
    filePath: './audio/music/fluffing-a-duck.mp3',
    loop: true,
    isMusic: true,
  },
  {
    key: 'music2',
    filePath: './audio/music/sneaky-snitch.mp3',
    loop: true,
    isMusic: true,
  },
  {
    key: 'music3',
    filePath: './audio/music/spook.mp3',
    loop: true,
    isMusic: true,
  },
  {
    key: 'punch',
    filePath: './audio/sfx/punch.wav',
    loop: false,
  },
  {
    key: 'jump',
    filePath: './audio/sfx/jump.mp3',
    loop: false,
  },
  {
    key: 'coin',
    filePath: './audio/sfx/coin.mp3',
    loop: false,
  },
];

class GameScene extends Phaser.Scene {
  private coinHud: CoinHud | undefined;

  private coins = 0; // this resets to zero every time the scene loads

  private score: Text | undefined; // not really a score

  private parallax: Parallax | undefined;

  public audio: Audio | undefined;

  public level: Level | undefined;

  public player: Ben3 | undefined;

  public goal: Skull | undefined;

  public static preloadExternal(scene: Phaser.Scene) {
    Parallax.preload(scene, parallaxName);
    Level.preload(scene, levelConfig);
    Audio.preload(scene, soundConfig);
    Coin.preload(scene);
  }

  constructor() {
    super('game-scene');
  }

  preload() {
    Parallax.preload(this, parallaxName);
    Level.preload(this, levelConfig);
    Audio.preload(this, soundConfig);
    Coin.preload(this);
  }

  create() {
    if (isDev) this.input.keyboard?.on('keydown-CTRL', () => toggleDebug(this));
    if (isDev) this.matter.add.mouseSpring();

    this.parallax = new Parallax(this, parallaxName);
    this.level = new Level(this, levelConfig);
    this.audio = new Audio(this, soundConfig);

    this.audio.playAudio('music1');

    this.player = this.level.spawners.player.getChildren()[0] as Ben3;
    this.goal = this.level.spawners.goal.getChildren()[0] as Skull;

    // keyboard controls
    this.input.keyboard
      ?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
      .on('down', this.jump.bind(this));

    // touch tap mobile and mouse leftclick controls
    this.input.on('pointerdown', this.jump.bind(this));

    this.score = new Text(this, 10, 50);

    // set sfx/music mute from local storage
    const [isSFXMute] = useLocalStorage('isSFXMute', false);
    this.audio?.setSFXMute(isSFXMute);
    const [isMusicMute] = useLocalStorage('isMusicMute', false);
    this.audio?.setMusicMute(isMusicMute);

    settingsMenu(this);

    this.coinHud = new CoinHud(this, this.coins);
  }

  jump() {
    if (!this.level || !this.player || !this.audio) return;
    this.player.jump();
  }

  collectCoin() {
    if (!this.coinHud) return;

    this.coins += 1;
    this.coinHud.updateCoinsDisplay(this.coins);

    const [coins, setCoins] = useLocalStorage('coins', 0);
    setCoins(coins + 1);
  }

  update() {
    if (!this.parallax || !this.level || !this.player || !this.score) return;

    this.parallax.update();

    smoothMoveCameraTowards(this, this.player.gameObject, 0.8);

    const [myNum, setMyNum] = useLocalStorage('testNum', 0);
    setMyNum(myNum + 1);
    this.score.textbox.text = String(myNum).padStart(9, '0');
  }
}

export default GameScene;
