import UIElement, { UIElementNames } from '@/objects/UIElement';
import googleFont, { FontFamilyEnum } from '@/helpers/googleFont';
import CoinHud from '@/overlays/CoinHud';
import noNew from '@/helpers/noNew';
import useLocalStorage from '@/helpers/useLocalStorage';
import isDev from '@/helpers/isDev';

const { getValue: getCoins, setValue: setCoins } = useLocalStorage('coins', 0);
const { getValue: getPurchased, setValue: setPurchased } = useLocalStorage(
  'purchased',
  {
    COIN2: false,
    REGEN: false,
    ARMOR: false,
    SPEED: false,
    JUMPD: false,
    JETPK: false,
  },
);

const currencyFormat = (value: number) =>
  `🪙 ${Intl.NumberFormat().format(value)}`;

const setPurchasedById = (id: string, newPurchsed: boolean) => {
  const purchased = getPurchased();
  setPurchased({ ...purchased, [id]: newPurchsed });
};

const items = [
  { id: 'COIN2', label: 'Coin Multiplier x2', price: 100 },
  { id: 'REGEN', label: 'Health Regeneration', price: 1_000 },
  { id: 'ARMOR', label: 'Kevlar Body Armour', price: 1_000 },
  { id: 'SPEED', label: 'Move Speed Boost', price: 1_000 },
  { id: 'JUMPD', label: 'Jump Distance Boost', price: 10_000 },
  { id: 'JETPK', label: 'NASA Jetpack', price: 100_000 },
];

class ShopScene extends Phaser.Scene {
  private coinHud: CoinHud | undefined;

  private itemButtons: { button: UIElement }[] | undefined;

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

    // back button
    noNew(UIElement, this, cx, height - 100, {
      uiElementName: UIElementNames.yellow_button01,
      content: 'BACK',
      color: '#000',
      width: 200,
      onClick: () => {
        this.scene.start('main-menu-scene');
      },
    });

    // debug
    if (isDev) {
      noNew(UIElement, this, 100, 80, {
        uiElementName: UIElementNames.blue_button00,
        content: 'reset',
        width: 150,
        onClick: () => {
          setCoins(0);
          this.coinHud?.updateCoinsDisplay(0);
        },
      });
      noNew(UIElement, this, 100, 150, {
        uiElementName: UIElementNames.blue_button00,
        content: '+1000',
        width: 150,
        onClick: () => {
          updateCoinsRelative(1000);
        },
      });
    }

    this.drawItems();
  }

  drawItems() {
    const { width } = this.sys.game.canvas;
    const cx = width / 2;

    const updateCoinsRelative = (changeBy: number) => {
      const coins = getCoins();
      const newCoins = coins + changeBy;
      setCoins(newCoins);
      this.coinHud?.updateCoinsDisplay(newCoins);
    };

    // clear old buttons
    if (this.itemButtons)
      this.itemButtons.forEach(({ button }) => button.destroy());

    // draw buttons
    const purchased = getPurchased();
    this.itemButtons = items.map(({ id, label, price }, i) => {
      const isPurchased = purchased[id];
      const transactionType = !purchased[id] ? 'Get' : 'Refund';
      const buttonType = !purchased[id]
        ? UIElementNames.yellow_button01
        : UIElementNames.blue_button00;
      const content = `${transactionType} ${label} ${currencyFormat(price)}`;
      const button = new UIElement(this, cx, 150 + i * 75, {
        uiElementName: buttonType,
        content,
        width: 600,
        color: '#000',
        onClick: () => {
          updateCoinsRelative(!isPurchased ? -price : price);
          setPurchasedById(id, !isPurchased);
          this.drawItems();
        },
      });

      return {
        id,
        label,
        price,
        isPurchased,
        button,
      };
    });
  }
}

export default ShopScene;
