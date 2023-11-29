import UIElement, { UIElementNames } from '@/objects/UIElement';
import googleFont, { FontFamilyEnum } from '@/helpers/googleFont';
import CoinHud from '@/overlays/CoinHud';
import noNew from '@/helpers/noNew';
import useLocalStorage from '@/helpers/useLocalStorage';

const { getValue: getCoins } = useLocalStorage('coins', 0);

const items = ['item 1', 'item 2', 'item 3'];

class ShopScene extends Phaser.Scene {
  public static preload(scene: Phaser.Scene) {
    UIElement.preload(scene);
  }

  constructor() {
    super('shop-scene');
  }

  preload() {
    ShopScene.preload(this);
  }

  create() {
    const { width, height } = this.sys.game.canvas;
    const cx = width / 2;
    const cy = height / 2;

    googleFont(this, cx, cy - 300, {
      fontFamily: FontFamilyEnum.BAGEL,
      text: 'Shop',
      color: '#FFF',
      fontSize: 64,
      origin: 0.5,
    });

    const localStorageCoins = getCoins();
    noNew(CoinHud, this, localStorageCoins);

    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      noNew(UIElement, this, cx, 150 + i * 75, {
        uiElementName: UIElementNames.yellow_button01,
        content: item,
        width: 400,
        onClick: () => {
          // eslint-disable-next-line no-alert
          alert('Under construction!');
          this.scene.start('main-menu-scene');
        },
      });
    }
  }
}

export default ShopScene;
