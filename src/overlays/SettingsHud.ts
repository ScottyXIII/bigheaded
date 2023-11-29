import fullscreenAndLandscape from '@/helpers/fullscreen';
import { IconEnum } from '@/helpers/googleFont';
import iconButton from '@/helpers/iconButton';
import isDev from '@/helpers/isDev';
import noNew from '@/helpers/noNew';
import useLocalStorage from '@/helpers/useLocalStorage';
import UIElement, { UIElementNames } from '@/objects/UIElement';
import GameScene from '@/scenes/game-scene';

// get state from LS
const { getValue: getIsMusicMute, setValue: setIsMusicMute } = useLocalStorage(
  'isMusicMute',
  false,
);
const { getValue: getIsSFXMute, setValue: setIsSFXMute } = useLocalStorage(
  'isSFXMute',
  false,
);

const buttonConfig = [
  {
    buttonName: 'settings',
    icons: [IconEnum.CLOSE, IconEnum.SETTINGS],
    allowVisibilityChange: false,
  },
  {
    buttonName: 'refresh',
    icons: [IconEnum.REFRESH],
    allowVisibilityChange: true,
  },
  {
    buttonName: 'isSFXMute',
    icons: [IconEnum.SFXOFF, IconEnum.SFXON],
    allowVisibilityChange: true,
  },
  {
    buttonName: 'isMusicMute',
    icons: [IconEnum.MUSICOFF, IconEnum.MUSICON],
    allowVisibilityChange: true,
  },
  {
    buttonName: 'isFullscreen',
    icons: [IconEnum.FULLSCREENON, IconEnum.FULLSCREENOFF],
    allowVisibilityChange: true,
  },
  ...(isDev
    ? [
        {
          buttonName: 'isDebugOn',
          icons: [IconEnum.EYEOPEN, IconEnum.EYECLOSED],
          allowVisibilityChange: true,
        },
      ]
    : []),
];

type RegistryItem = {
  buttonName: string;
  onClickHandler: () => void;
};

class SettingsHud {
  private scene: GameScene;

  private isOpen = false;

  private buttons: { buttonName: string; btn: Phaser.GameObjects.Text }[];

  private onClickRegistry: RegistryItem[] = [];

  constructor(scene: GameScene) {
    this.scene = scene;

    const { width, height } = scene.sys.game.canvas;

    this.buttons = buttonConfig.map(({ buttonName, icons }, i) => {
      const btn = iconButton(scene, width - 48, 48 + 48 * 2 * i, {
        icon: icons[0], // default icon is "true" state
        onClick: () => {
          const onClickHandlersForButtonName = this.onClickRegistry
            .filter(item => item.buttonName === buttonName)
            .map(({ onClickHandler }) => onClickHandler);
          onClickHandlersForButtonName?.forEach(onClick => onClick());
        },
      });
      return { buttonName, btn };
    });

    // hide all child buttons
    this.setMenuOpen(this.isOpen);

    // setup initial states
    this.setButtonState('settings', this.isOpen);
    this.setButtonState('isSFXMute', getIsSFXMute());
    this.setButtonState('isMusicMute', getIsMusicMute());
    this.setButtonState('isFullscreen', false);

    // connect click actions
    this.registerOnClick('settings', () => {
      const newState = !this.isOpen;
      this.isOpen = newState;
      this.setMenuOpen(newState);
    });
    this.registerOnClick('refresh', () => window.location.reload());
    this.registerOnClick('isSFXMute', () => {
      const isSFXMute = getIsSFXMute();
      const newIsSFXMute = !isSFXMute;
      setIsSFXMute(newIsSFXMute);
      this.setButtonState('isSFXMute', newIsSFXMute);
      scene.audio?.setSFXMute(newIsSFXMute);
    });
    this.registerOnClick('isMusicMute', () => {
      const isMusicMute = getIsMusicMute();
      const newIsMusicMute = !isMusicMute;
      setIsMusicMute(newIsMusicMute);
      this.setButtonState('isMusicMute', newIsMusicMute);
      scene.audio?.setMusicMute(newIsMusicMute);
    });
    this.registerOnClick('isFullscreen', () => {
      fullscreenAndLandscape();
      this.setButtonState('isFullscreen', true);
    });

    if (isDev) {
      noNew(UIElement, this, 100, height - 100, {
        content: 'scene selector',
        width: 300,
        onClick: () => scene.scene.start('scene-selector-scene'), // TODO: make the scene
        uiElementName: UIElementNames.blue_button00,
      });
    }
  }

  setMenuOpen(isOpen: boolean) {
    this.setButtonState('settings', isOpen);
    this.buttons.forEach(item => {
      const allowVisibilityChange =
        buttonConfig.find(
          configItem => configItem.buttonName === item.buttonName,
        )?.allowVisibilityChange || false;

      if (allowVisibilityChange) item.btn.visible = isOpen;
    });
  }

  registerOnClick(buttonName: string, onClickHandler: () => void) {
    this.onClickRegistry.push({ buttonName, onClickHandler });
  }

  setButtonState(buttonName: string, isOn: boolean) {
    this.buttons.forEach(item => {
      if (item.buttonName === buttonName) {
        const icons = buttonConfig.find(
          configItem => configItem.buttonName === buttonName,
        )?.icons || ['X', 'X'];
        const icon = isOn ? icons[0] : icons[1];
        item.btn.setText(icon);
      }
    });
  }

  // turn green hitArea boxes on / off in this menu
  setHitAreaDebug(isOn: boolean) {
    const fnName = isOn ? 'enableDebug' : 'removeDebug';
    this.buttons.forEach(item => {
      this.scene.input[fnName](item.btn);
    });
  }
}

export default SettingsHud;
