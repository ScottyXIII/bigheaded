import * as Phaser from 'phaser';

import smoothMoveCameraTowards from '@/helpers/smoothMoveCameraTowards';
import useLocalStorage from '@/helpers/useLocalStorage';

import Parallax, { ParallaxNames } from '@/objects/Parallax';
import Level, { LevelConfigType } from '@/objects/Level';
import Audio from '@/objects/Audio';
import SettingsHud from '@/overlays/SettingsHud';
import CoinHud from '@/overlays/CoinHud';

import Bob3 from '@/objects/entities/Bob3';
import Bat from '@/objects/entities/Bat';
import Tomato from '@/objects/entities/Tomato';
import Hedgehog from '@/objects/entities/Hedgehog';
import Coin from '@/objects/entities/Coin';

import Skull from '@/objects/Skull';
import initDebug from '@/helpers/initDebug';
import isDev from '@/helpers/isDev';
import Control from '@/objects/Control';

const { getValue: getCoins, setValue: setCoins } = useLocalStorage('coins', 0);
const { getValue: getIsSFXMute } = useLocalStorage('isSFXMute', false);
const { getValue: getIsMusicMute } = useLocalStorage('isMusicMute', false);

const parallaxName: ParallaxNames = 'supermountaindusk';

const levelConfig: LevelConfigType = {
  tilesetPng: './level/tileset/sd-tileset64a.png',
  tiledMapJson: './level/tiled-level/level-1.json',
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
      classFactory: Bob3,
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
    key: 'music3',
    filePath: './audio/music/spook.mp3',
    loop: true,
    isMusic: true,
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
  {
    key: 'gameover',
    filePath: './audio/sfx/gameover.mp3',
    loop: false,
  },
];

class GameScene extends Phaser.Scene {
  private settingsHud: SettingsHud | undefined;

  private coinHud: CoinHud | undefined;

  private coins = 0; // this resets to zero every time the scene loads

  private parallax: Parallax | undefined;

  public audio: Audio | undefined;

  public level: Level | undefined;

  public player: Bob3 | undefined;

  public control: Control | undefined;

  public goal: Skull | undefined;

  public static preload(scene: Phaser.Scene) {
    Parallax.preload(scene, parallaxName);
    Level.preload(scene, levelConfig);
    Audio.preload(scene, soundConfig);
    Coin.preload(scene);
  }

  constructor() {
    super('game-scene');
  }

  preload() {
    GameScene.preload(this);
  }

  create() {
    this.control = new Control(this);
    this.parallax = new Parallax(this, parallaxName);
    this.level = new Level(this, levelConfig);
    this.audio = new Audio(this, soundConfig);

    // set sfx/music mute from local storage
    this.audio.setSFXMute(getIsSFXMute());
    this.audio.setMusicMute(getIsMusicMute());
    this.audio.playAudio('music1');

    this.player = this.level.spawners.player.getChildren()[0] as Bob3;
    this.goal = this.level.spawners.goal.getChildren()[0] as Skull;

    this.coinHud = new CoinHud(this, this.coins); // not coins from LS

    this.settingsHud = new SettingsHud(this);
    if (isDev) {
      const { toggleDebug } = initDebug(this, this.settingsHud);
      this.settingsHud.registerOnClick('isDebugOn', toggleDebug);
    }
  }

  collectCoin() {
    if (!this.coinHud) return;

    this.coins += 1;
    this.coinHud.updateCoinsDisplay(this.coins);

    setCoins(getCoins() + 1); // save to meta balance in ls
  }

  update() {
    if (!this.parallax || !this.control || !this.player) return;

    this.parallax.update();
    this.control.update();

    smoothMoveCameraTowards(this, this.player.gameObject, 0.8);
  }
}

export default GameScene;
