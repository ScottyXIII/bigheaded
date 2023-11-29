import UIElement, { UIElementNames } from '@/objects/UIElement';
import googleFont, { FontFamilyEnum } from '@/helpers/googleFont';
import SettingsHud from '@/overlays/SettingsHud';
import CoinHud from '@/overlays/CoinHud';
import useLocalStorage from '@/helpers/useLocalStorage';
import initDebug from '@/helpers/initDebug';
import isDev from '@/helpers/isDev';

const { getValue: getCoins } = useLocalStorage('coins', 0);

class MainMenuScene extends Phaser.Scene {
  private settingsHud: SettingsHud | undefined;

  private coinHud: CoinHud | undefined;

  // @ts-expect-error lesser of all the evils
  private btn: UIElement | undefined;

  public static preload(scene: Phaser.Scene) {
    UIElement.preload(scene);
  }

  constructor() {
    super('main-menu-scene');
  }

  preload() {
    MainMenuScene.preload(this);
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

    this.btn = new UIElement(this, cx, cy + 100, {
      content: 'START ADVENTURE',
      width: 400,
      onClick: () => this.scene.start('game-scene'),
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const aaa = new UIElement(this, cx, cy + 200, {
      content: 'Shop',
      width: 300,
      onClick: () => this.scene.start('game-scene'),
      uiElementName: UIElementNames.ButtonOrange,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const bbb = new UIElement(this, cx, cy + 300, {
      content: 'scene selector',
      width: 300,
      onClick: () => this.scene.start('game-scene'),
      uiElementName: UIElementNames.blue_button00,
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

export default MainMenuScene;
