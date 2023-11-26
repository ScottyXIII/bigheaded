import { IconEnum } from '@/helpers/googleFont';
import iconButton from '@/helpers/iconButton';
import isDev from '@/helpers/isDev';

const childConfig = [
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
    buttonName: 'fullscreen',
    icons: [IconEnum.FULLSCREEN],
    allowVisibilityChange: true,
  },
  {
    buttonName: 'isDebugOn',
    icons: [IconEnum.EYEOPEN, IconEnum.EYECLOSED],
    allowVisibilityChange: isDev,
  },
];

type RegistryItem = {
  buttonName: string;
  onClickHandler: () => void;
};

class SettingsHud {
  private scene: Phaser.Scene;

  private isOpen = false;

  private buttons: { buttonName: string; btn: Phaser.GameObjects.Text }[];

  private onClickRegistry: RegistryItem[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    const { width } = scene.sys.game.canvas;

    this.buttons = childConfig.map(({ buttonName, icons }, i) => {
      const btn = iconButton(scene, width - 100 - 48, 48 + 48 * 2 * i, {
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

    this.setMenuOpen(this.isOpen); // hide all child buttons

    // setup settings button
    this.setButtonState('settings', this.isOpen);
    this.registerOnClick('settings', () => {
      this.setMenuOpen(!this.isOpen);
      this.isOpen = !this.isOpen;
    });

    // setup refresh button
    this.registerOnClick('refresh', () => window.location.reload());

    // this.setButtonState('isSFXMute', false);

    this.registerOnClick('isSFXMute', () => alert('isSFXMute'));
    this.registerOnClick('isMusicMute', () => alert('isMusicMute'));
    this.registerOnClick('fullscreen', () => alert('fullscreen'));
    this.registerOnClick('isDebugOn', () => alert('debug'));
  }

  setMenuOpen(isOpen: boolean) {
    this.setButtonState('settings', isOpen);
    this.buttons.forEach(item => {
      const allowVisibilityChange =
        childConfig.find(
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
        const icons = childConfig.find(
          configItem => configItem.buttonName === buttonName,
        )?.icons || ['X', 'X'];
        const icon = isOn ? icons[0] : icons[1];
        item.btn.setText(icon);
      }
    });
  }

  // turn green hitArea boxes on / off
  setDebug(isOn: boolean) {
    const func = isOn
      ? this.scene.input.enableDebug
      : this.scene.input.removeDebug;
    this.buttons.forEach(item => func(item.btn));
  }
}

export default SettingsHud;
