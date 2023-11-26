import { IconEnum } from '@/helpers/googleFont';
import fullscreenAndLandscape from '@/helpers/fullscreen';
import useLocalStorage from '@/helpers/useLocalStorage';
import isDev from '@/helpers/isDev';
import iconButton from '@/helpers/iconButton';
import Audio from '@/objects/Audio';

const settingsMenu = (scene: Phaser.Scene & { audio?: Audio }) => {
  const { width } = scene.sys.game.canvas;

  let isOpen = false;

  const refresh = iconButton(scene, width - 48, 48 * 3, {
    icon: IconEnum.REFRESH,
    onClick: () => window.location.reload(),
  });
  refresh.visible = false;

  const [isSFXMute] = useLocalStorage('isSFXMute', false);
  const sfxToggle = iconButton(scene, width - 48, 48 * 5, {
    icon: isSFXMute ? IconEnum.SFXOFF : IconEnum.SFXON,
    onClick: () => {
      const [isSFXMute, setIsSFXMute] = useLocalStorage('isSFXMute', false);
      const newSfxIsMute = !isSFXMute;
      setIsSFXMute(newSfxIsMute);
      scene.audio?.setSFXMute(newSfxIsMute);
      sfxToggle.setText(newSfxIsMute ? IconEnum.SFXOFF : IconEnum.SFXON);
    },
  });
  sfxToggle.visible = false;

  const [isMusicMute] = useLocalStorage('isMusicMute', false);
  const musicToggle = iconButton(scene, width - 48, 48 * 7, {
    icon: isMusicMute ? IconEnum.MUSICOFF : IconEnum.MUSICON,
    onClick: () => {
      const [isMusicMute, setIsMusicMute] = useLocalStorage(
        'isMusicMute',
        false,
      );
      const newIsMusicMute = !isMusicMute;
      setIsMusicMute(newIsMusicMute);
      scene.audio?.setMusicMute(newIsMusicMute);
      musicToggle.setText(
        newIsMusicMute ? IconEnum.MUSICOFF : IconEnum.MUSICON,
      );
    },
  });
  musicToggle.visible = false;

  const fullscreen = iconButton(scene, width - 48, 48 * 9, {
    icon: IconEnum.FULLSCREEN,
    onClick: fullscreenAndLandscape,
  });
  fullscreen.visible = false;

  const toggleDebugShapes = iconButton(scene, width - 48, 48 * 11, {
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
    sfxToggle.visible = true;
    musicToggle.visible = true;
    fullscreen.visible = true;
    if (isDev) toggleDebugShapes.visible = true;
  };

  const close = () => {
    refresh.visible = false;
    sfxToggle.visible = false;
    musicToggle.visible = false;
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
