import googleFont, { FontFamilyEnum } from '@/helpers/googleFont';
import SettingsHud from '@/overlays/SettingsHud';
import useLocalStorage from '@/helpers/useLocalStorage';
import initDebug from '@/helpers/initDebug';
import isDev from '@/helpers/isDev';
import noNew from '@/helpers/noNew';
import UIElement, { UIElementNames } from '@/objects/UIElement';
import Audio from '@/objects/Audio';

const { getValue: getCoins } = useLocalStorage('coins', 0);
const { getValue: getIsSFXMute } = useLocalStorage('isSFXMute', false);
const { getValue: getIsMusicMute } = useLocalStorage('isMusicMute', false);

const soundConfig = [
  {
    key: 'music2',
    filePath: './audio/music/sneaky-snitch.mp3',
    loop: true,
    isMusic: true,
  },
];

class MainMenuScene extends Phaser.Scene {
  public audio: Audio | undefined;

  public static preload(scene: Phaser.Scene) {
    UIElement.preload(scene);
    Audio.preload(scene, soundConfig);
  }

  constructor() {
    super('main-menu-scene');
  }

  preload() {
    MainMenuScene.preload(this);
  }

  create() {
    this.audio = new Audio(this, soundConfig);

    // set sfx/music mute from local storage
    this.audio.setSFXMute(getIsSFXMute());
    this.audio.setMusicMute(getIsMusicMute());
    this.audio.playAudio('music2');

    const { width, height } = this.sys.game.canvas;
    const cx = width / 2;
    const cy = height / 2;

    googleFont(this, cx, cy - 100, {
      fontFamily: FontFamilyEnum.BAGEL,
      text: 'Bigheaded',
      color: '#FFF',
      fontSize: 128,
      origin: 0.5,
    });

    noNew(UIElement, this, cx, cy + 100, {
      content: 'START ADVENTURE',
      width: 400,
      onClick: () => this.scene.start('game-scene'),
    });

    const localStorageCoins = getCoins();
    if (localStorageCoins > 0) {
      noNew(UIElement, this, cx, cy + 220, {
        uiElementName: UIElementNames.yellow_button01,
        content: 'Power Up!',
        color: '#000',
        width: 300,
        onClick: () => this.scene.start('shop-scene'),
      });
    }

    // @ts-expect-error needs class inheritance refactoring
    const settingsHud = new SettingsHud(this);
    if (isDev) {
      const { toggleDebug } = initDebug(this, settingsHud);
      settingsHud.registerOnClick('isDebugOn', toggleDebug);
    }
  }
}

export default MainMenuScene;
