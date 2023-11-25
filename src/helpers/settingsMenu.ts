import { IconEnum } from '@/helpers/googleFont';
import iconButton from '@/helpers/iconButton';
import fullscreenAndLandscape from '@/helpers/fullscreen';
import useLocalStorage from './useLocalStorage';
import isDev from './isDev';

const settingsMenu = (scene: Phaser.Scene) => {
  const { width } = scene.sys.game.canvas;

  let isOpen = false;

  const refresh = iconButton(scene, width - 48, 48 * 3, {
    icon: IconEnum.REFRESH,
    onClick: () => window.location.reload(),
  });
  refresh.visible = false;

  const [isMute] = useLocalStorage('isMute', false);
  const soundToggle = iconButton(scene, width - 48, 48 * 5, {
    icon: isMute ? IconEnum.SOUNDOFF : IconEnum.SOUNDON,
    onClick: () => {
      const [isMute, setIsMute] = useLocalStorage('isMute', false);
      const newIsMute = !isMute;
      setIsMute(newIsMute);
      scene.game.sound.mute = newIsMute;
      soundToggle.setText(newIsMute ? IconEnum.SOUNDOFF : IconEnum.SOUNDON);
    },
  });
  soundToggle.visible = false;

  const fullscreen = iconButton(scene, width - 48, 48 * 7, {
    icon: IconEnum.FULLSCREEN,
    onClick: fullscreenAndLandscape,
  });
  fullscreen.visible = false;

  const toggleDebugShapes = iconButton(scene, width - 48, 48 * 9, {
    icon: IconEnum.EYEOPEN,
    onClick: () => {
      const oldDrawDebug = scene.matter.world.drawDebug;
      const newDrawDebug = !oldDrawDebug;
      scene.matter.world.drawDebug = newDrawDebug;
      scene.matter.world.debugGraphic.clear();

      toggleDebugShapes.setText(
        newDrawDebug ? IconEnum.EYEOPEN : IconEnum.EYECLOSED,
      );
    },
  });
  toggleDebugShapes.visible = false;

  const open = () => {
    refresh.visible = true;
    soundToggle.visible = true;
    fullscreen.visible = true;
    if (isDev) toggleDebugShapes.visible = true;
  };

  const close = () => {
    refresh.visible = false;
    soundToggle.visible = false;
    fullscreen.visible = false;
    toggleDebugShapes.visible = false;
  };

  const cog = iconButton(scene, width - 48, 48 * 1, {
    icon: IconEnum.SETTINGS,
    onClick: () => {
      if (isOpen) {
        isOpen = false;
        cog.setText(IconEnum.CLOSE);
        open();
      } else {
        isOpen = true;
        cog.setText(IconEnum.SETTINGS);
        close();
      }
    },
  });
};

export default settingsMenu;
