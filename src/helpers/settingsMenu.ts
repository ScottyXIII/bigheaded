import { IconEnum } from '@/helpers/googleFont';
import iconButton from '@/helpers/iconButton';

const settingsMenu = (scene: Phaser.Scene) => {
  const { width } = scene.sys.game.canvas;

  let isOpen = false;

  const refresh = iconButton(scene, width - 48, 48 * 3, {
    icon: IconEnum.REFRESH,
    onClick: () => window.location.reload(),
  });
  refresh.visible = false;

  const soundToggle = iconButton(scene, width - 48, 48 * 5, {
    icon: IconEnum.SOUNDON,
    onClick: () => {},
  });
  soundToggle.visible = false;

  const fullscreen = iconButton(scene, width - 48, 48 * 7, {
    icon: IconEnum.FULLSCREEN,
    onClick: () => {},
  });
  fullscreen.visible = false;

  const cog = iconButton(scene, width - 48, 48 * 1, {
    icon: IconEnum.SETTINGS,
    onClick: () => {
      if (isOpen) {
        isOpen = false;
        cog.setText(IconEnum.CLOSE);
        refresh.visible = true;
        soundToggle.visible = true;
        fullscreen.visible = true;
      } else {
        isOpen = true;
        cog.setText(IconEnum.SETTINGS);
        refresh.visible = false;
        soundToggle.visible = false;
        fullscreen.visible = false;
      }
    },
  });
};

export default settingsMenu;
