import Text from '@/objects/Text';
import Button from '@/objects/Button';
import GameScene from '@/scenes/game-scene';
import googleFont, { FontFamilyEnum } from '@/helpers/googleFont';
import SettingsHud from '@/overlays/SettingsHud';
import CoinHud from '@/overlays/CoinHud';
import useLocalStorage from '@/helpers/useLocalStorage';
import initDebug from '@/helpers/initDebug';
import isDev from '@/helpers/isDev';
import DeathScene from './death-scene';

const { getValue: getCoins } = useLocalStorage('coins', 0);

class PreloaderScene extends Phaser.Scene {
  private settingsHud: SettingsHud | undefined;

  private coinHud: CoinHud | undefined;

  // @ts-expect-error lesser of all the evils
  private btn: Button | undefined;

  constructor() {
    super('preloader-scene');
  }

  preload() {
    Button.preload(this);

    const { width, height } = this.sys.game.canvas;
    const cx = width / 2;
    const cy = height / 2;
    const message1 = new Text(this, cx, cy - 20);
    const message2 = new Text(this, cx, cy + 20);

    message1.textbox.setOrigin(0.5, 0.5);
    message2.textbox.setOrigin(0.5, 0.5);

    message1.textbox.text = '0%';
    message2.textbox.text = 'LOADING...';

    this.load.on('progress', (value: number) => {
      const percent = Math.floor(value * 100);
      message1.textbox.text = `${percent}%`;
    });

    this.load.on('fileprogress', (file: { src: string }) => {
      console.log(file);
      const parts = file.src.split('/');
      message2.textbox.text = parts[parts.length - 1];
    });

    this.load.on('complete', () => {
      message1.textbox.text = '';
      message2.textbox.text = '';
    });

    GameScene.preload(this);
    DeathScene.preload(this);
  }

  create() {
    const { width, height } = this.sys.game.canvas;
    const cx = width / 2;
    const cy = height / 2;

    googleFont(this, cx, cy - 100, {
      fontFamily: FontFamilyEnum.BAGEL,
      text: 'BigHeaded',
      color: '#FFF',
      fontSize: 128,
      origin: 0.5,
    });

    this.btn = new Button(this, cx, cy + 100, {
      content: 'START ADVENTURE',
      width: 400,
      onClick: () => this.scene.start('game-scene'),
    });

    // @ts-expect-error needs class inheritance refactoring
    this.settingsHud = new SettingsHud(this);
    this.coinHud = new CoinHud(this, getCoins()); // coins from localstorage
    this.coinHud.updateCoinsDisplay(getCoins());

    if (isDev) {
      const { toggleDebug } = initDebug(this, this.settingsHud);
      this.settingsHud.registerOnClick('isDebugOn', toggleDebug);
    }
  }
}

export default PreloaderScene;
