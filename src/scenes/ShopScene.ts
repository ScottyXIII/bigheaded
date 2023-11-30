import UIElement, { UIElementNames } from '@/objects/UIElement';
import googleFont, { FontFamilyEnum } from '@/helpers/googleFont';
import CoinHud from '@/overlays/CoinHud';
import noNew from '@/helpers/noNew';
import useLocalStorage from '@/helpers/useLocalStorage';
import isDev from '@/helpers/isDev';

const { getValue: getCoins, setValue: setCoins } = useLocalStorage('coins', 0);
const { getValue: getPurchased, setValue: setPurchased } = useLocalStorage(
  'purchased',
  0,
);

const items = [
  { name: 'Coins x2', price: 10 },
  { name: 'Speed Boost', price: 100 },
  { name: 'Jump Distance Boost', price: 1_000 },
];

class ShopScene extends Phaser.Scene {
  private coinHud: CoinHud | undefined;

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

    this.coinHud = new CoinHud(this, getCoins());

    const updateCoinsRelative = (changeBy: number) => {
      const coins = getCoins();
      const newCoins = coins + changeBy;
      setCoins(newCoins);
      this.coinHud?.updateCoinsDisplay(newCoins);
    };

    const itemButtons = [];

    for (let i = 0; i < items.length; i += 1) {
      const { name, price } = items[i];
      itemButtons.push(
        noNew(UIElement, this, cx, 150 + i * 75, {
          uiElementName: UIElementNames.yellow_button01,
          content: `${name} - 🪙 ${price}`,
          width: 500,
          color: '#000',
          onClick: () => {
            updateCoinsRelative(-price);
          },
        }),
      );
    }

    noNew(UIElement, this, cx, height - 100, {
      uiElementName: UIElementNames.yellow_button01,
      content: 'BACK',
      width: 400,
      onClick: () => {
        this.scene.start('main-menu-scene');
      },
    });

    // debug
    if (isDev) {
      noNew(UIElement, this, 100, 80, {
        uiElementName: UIElementNames.blue_button00,
        content: 'zero',
        width: 120,
        onClick: () => {
          setCoins(0);
          this.coinHud?.updateCoinsDisplay(0);
        },
      });
      noNew(UIElement, this, 100, 150, {
        uiElementName: UIElementNames.blue_button00,
        content: '+1000',
        width: 120,
        onClick: () => {
          updateCoinsRelative(1000);
        },
      });
    }
  }
}

export default ShopScene;
