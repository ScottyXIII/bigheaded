import googleFont, { FontFamilyEnum, IconEnum } from '@/helpers/googleFont';

const iconConfig = {
  color: '#ffffff99',
  fontSize: 256,
  origin: 0.5,
  padding: {
    top: 200, // fix chrome cutoff icons, it does not affect position
  },
  fontFamily: FontFamilyEnum.ICONS,
};

const onScreenDuration = 4_000;

const titles = (scene: Phaser.Scene) => {
  const { width, height } = scene.scale;

  const balance = googleFont(scene, width * 0.25, height * 0.45, {
    color: '#ffffff99',
    fontSize: 64,
    origin: 0.5,
    text: 'BALANCE',
    fontFamily: FontFamilyEnum.BAGEL,
  });

  const jump = googleFont(scene, width * 0.75, height * 0.45, {
    color: '#ffffff99',
    fontSize: 64,
    origin: 0.5,
    text: 'JUMP',
    fontFamily: FontFamilyEnum.BAGEL,
  });

  setTimeout(() => {
    balance.destroy();
    jump.destroy();
  }, onScreenDuration);
};

const keyboardTutorial = (scene: Phaser.Scene) => {
  const { width, height } = scene.scale;

  const horiz = googleFont(scene, width * 0.25, height * 0.75, {
    ...iconConfig,
    fontSize: 128,
    icon: IconEnum.HORIZONTALARROWS,
  });

  const keys = googleFont(scene, width * 0.25, height * 0.71, {
    color: '#ffffff99',
    fontSize: 128,
    origin: 0.5,
    text: 'A       D',
    fontFamily: FontFamilyEnum.BAGEL,
  });

  const space = googleFont(scene, width * 0.75, height * 0.71, {
    color: '#ffffff99',
    fontSize: 128,
    origin: 0.5,
    text: 'SPACE',
    fontFamily: FontFamilyEnum.BAGEL,
  });

  setTimeout(() => {
    horiz.destroy();
    keys.destroy();
    space.destroy();
  }, onScreenDuration);
};

const touchTutorial = (scene: Phaser.Scene) => {
  const { width, height } = scene.scale;

  const swipe = googleFont(scene, width * 0.25, height * 0.75, {
    ...iconConfig,
    icon: IconEnum.TOUCHSWIPE,
  });

  const tap = googleFont(scene, width * 0.75, height * 0.75, {
    ...iconConfig,
    icon: IconEnum.TOUCHTAP,
  });

  setTimeout(() => {
    swipe.destroy();
    tap.destroy();
  }, onScreenDuration);
};

const controlsTutorial = (scene: Phaser.Scene) => {
  const hasTouch = scene.sys.game.device.input.touch;

  titles(scene);
  if (hasTouch) touchTutorial(scene);
  else keyboardTutorial(scene);
};

export default controlsTutorial;
