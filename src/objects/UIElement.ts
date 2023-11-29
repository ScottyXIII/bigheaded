import isDev from '@/helpers/isDev';

export enum UIElementNames {
  PopupBackground400 = 'PopupBackground400',
  blue_box = 'blue-box',
  yellow_panel = 'yellow_panel',
  pause_check_box = 'pause_check_box',
  ButtonBlueSml = 'ButtonBlueSml',
  LightBackground = 'LightBackground',
  btn_01 = 'btn-01',
  enemy_hp_bar = 'enemy_hp_bar',
  enemy_hp_fill = 'enemy_hp_fill',
  // blue_button07 = 'blue_button07',
  // yellow_button06 = 'yellow_button06',
  // blue_sliderDown = 'blue_sliderDown',
  // blue_sliderUp = 'blue_sliderUp',
  button_bg = 'button-bg',
  blue_button00 = 'blue_button00',
  // yellow_button07 = 'yellow_button07',
  // blue_sliderLeft = 'blue_sliderLeft',
  // blue_sliderRight = 'blue_sliderRight',
  blue_button13 = 'blue_button13',
  YellowButtonSml = 'YellowButtonSml',
  GreenButtonSml = 'GreenButtonSml',
  // yellow_sliderDown = 'yellow_sliderDown',
  // ButtonOrangeFill1 = 'ButtonOrangeFill1',
  PinkButtonSml = 'PinkButtonSml',
  RedButtonSml = 'RedButtonSml',
  ButtonOrange = 'ButtonOrange',
  // ButtonOrangeFill2 = 'ButtonOrangeFill2',
  yellow_button00 = 'yellow_button00',
  yellow_button02 = 'yellow_button02',
  // yellow_sliderUp = 'yellow_sliderUp',
  // yellow_button09 = 'yellow_button09',
  // yellow_circle = 'yellow_circle',
  yellow_button04 = 'yellow_button04',
  yellow_button13 = 'yellow_button13',
  // yellow_button11 = 'yellow_button11',
  // yellow_sliderLeft = 'yellow_sliderLeft',
  // yellow_sliderRight = 'yellow_sliderRight',
  blue_button05 = 'blue_button05',
  yellow_button01 = 'yellow_button01',
  // yellow_button08 = 'yellow_button08',
  // yellow_button10 = 'yellow_button10',
  yellow_button03 = 'yellow_button03',
  yellow_button05 = 'yellow_button05',
  // yellow_button12 = 'yellow_button12',
  // hp_fill = 'hp_fill',
}

type ButtonOptionsType = {
  content: string;
  width: number;
  onClick: () => void;
  uiElementName?: UIElementNames;
};

class UIElement extends Phaser.GameObjects.Container {
  public button: Phaser.GameObjects.NineSlice;

  static preload(scene: Phaser.Scene) {
    scene.load.atlas(
      'ui',
      'https://labs.phaser.io/assets/ui/nine-slice.png',
      'https://labs.phaser.io/assets/ui/nine-slice.json',
    );
  }

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    options: ButtonOptionsType,
  ) {
    super(scene, x, y);

    this.scene = scene;

    const {
      content,
      width,
      onClick,
      uiElementName = UIElementNames.button_bg,
    } = options;

    this.button = scene.add.nineslice(
      x,
      y,
      'ui',
      uiElementName,
      128,
      110,
      64,
      64,
    );

    const text = scene.add.text(x, y, content, {
      font: '25px Arial',
      align: 'center',
    });
    text.setOrigin(0.5, 0.5);
    text.setWordWrapWidth(width - 100);

    this.button.width = width;
    this.button.setInteractive({ useHandCursor: true });
    const hitboxPositionFix = (width - 128) / 2;
    this.button.input?.hitArea.setPosition(-hitboxPositionFix, 0);
    this.button.on('pointerdown', onClick);

    if (isDev) scene.input.enableDebug(this.button); // not toggleable atm

    scene.tweens.add({
      targets: [this.button],
      width: width + 20,
      duration: 300,
      ease: 'sine.inout',
      yoyo: true,
      repeat: -1,
    });
  }
}

export default UIElement;
