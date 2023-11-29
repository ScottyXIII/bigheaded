import UIElement, { UIElementNames } from '@/objects/UIElement';
import googleFont, { FontFamilyEnum } from '@/helpers/googleFont';
import SettingsHud from '@/overlays/SettingsHud';
import CoinHud from '@/overlays/CoinHud';
import useLocalStorage from '@/helpers/useLocalStorage';
import initDebug from '@/helpers/initDebug';
import isDev from '@/helpers/isDev';
import noNew from '@/helpers/noNew';

const { getValue: getCoins } = useLocalStorage('coins', 0);

class MainMenuScene extends Phaser.Scene {
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

    noNew(UIElement, this, cx, cy + 100, {
      content: 'START ADVENTURE',
      width: 400,
      onClick: () => this.scene.start('game-scene'),
    });

    noNew(UIElement, this, cx, cy + 200, {
      content: 'Shop',
      width: 300,
      onClick: () => this.scene.start('game-scene'),
      uiElementName: UIElementNames.ButtonOrange,
    });

    noNew(UIElement, this, cx, cy + 300, {
      content: 'scene selector',
      width: 300,
      onClick: () => this.scene.start('game-scene'),
      uiElementName: UIElementNames.blue_button00,
    });

    noNew(CoinHud, this, getCoins()); // coins from localstorage

    // @ts-expect-error needs class inheritance refactoring
    const settingsHud = new SettingsHud(this);

    if (isDev) {
      const { toggleDebug } = initDebug(this, settingsHud);
      settingsHud.registerOnClick('isDebugOn', toggleDebug);
    }
  }
}

export default MainMenuScene;
