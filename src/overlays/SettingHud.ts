import { IconEnum } from '@/helpers/googleFont';
import iconButton from '@/helpers/iconButton';

const config = [
  {
    buttonName: 'refresh',
    icon: [IconEnum.REFRESH],
    onClick: () => window.location.reload(),
  },
  {
    buttonName: 'isMute',
    icon: [IconEnum.SOUNDOFF, IconEnum.SOUNDON],
    // onClick: () => {
    //   const [isMute, setIsMute] = useLocalStorage('isMute', false);
    //   const newIsMute = !isMute;
    //   setIsMute(newIsMute);
    //   scene.game.sound.mute = newIsMute;
    //   soundToggle.setText(newIsMute ? IconEnum.SOUNDOFF : IconEnum.SOUNDON);
    // },
  },
];

class SettingsHud {
  private buttons: Phaser.GameObjects.Text[];

  constructor(scene: Phaser.Scene) {
    const { width } = scene.sys.game.canvas;

    this.buttons = config.map(({ buttonName, icon, onClick }, i) => {
      iconButton(scene, width - 48, 48 * (i + 3), {
        icon: IconEnum.FULLSCREEN,
        onClick: fullscreenAndLandscape,
      });
    });
  }

  setButtonState(buttonName: string, isOn: boolean) {}

  setDebug(isOn: boolean) {
    // turn off all the button hitboxes
  }
}

export default SettingsHud;
