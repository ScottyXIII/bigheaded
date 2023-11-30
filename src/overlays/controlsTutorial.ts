import googleFont, { FontFamilyEnum, IconEnum } from '@/helpers/googleFont';

const controlsTutorial = (scene: Phaser.Scene) => {
  const { width, height } = scene.scale;

  const hasKeyboard = !!scene.input.keyboard;

  const iconConfig = {
    color: '#ffffff99',
    fontSize: 256,
    origin: 0.5,
    padding: {
      top: 200, // fix chrome cutoff icons, it does not affect position
    },
    fontFamily: FontFamilyEnum.ICONS,
  };

  const balance = googleFont(scene, width * 0.25, height * 0.45, {
    color: '#ffffff99',
    fontSize: 64,
    origin: 0.5,
    text: 'BALANCE',
    fontFamily: FontFamilyEnum.BAGEL,
  });
  const swipe = googleFont(scene, width * 0.25, height * 0.75, {
    ...iconConfig,
    icon: IconEnum.TOUCHSWIPE,
  });

  const jump = googleFont(scene, width * 0.75, height * 0.45, {
    color: '#ffffff99',
    fontSize: 64,
    origin: 0.5,
    text: 'JUMP',
    fontFamily: FontFamilyEnum.BAGEL,
  });
  const tap = googleFont(scene, width * 0.75, height * 0.75, {
    ...iconConfig,
    icon: IconEnum.TOUCHTAP,
  });

  setTimeout(() => {
    swipe.destroy();
    tap.destroy();

    if (hasKeyboard) {
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
        balance.destroy();
        jump.destroy();

        horiz.destroy();
        keys.destroy();
        space.destroy();
      }, 2_000);
    } else {
      balance.destroy();
      jump.destroy();
    }
  }, 2_000);
};

export default controlsTutorial;
