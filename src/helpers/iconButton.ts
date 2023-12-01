import googleFont, { FontFamilyEnum, IconEnum } from './googleFont';

const iconButton = (
  scene: Phaser.Scene,
  x: number,
  y: number,
  {
    icon,
    onClick,
    ...other
  }: {
    icon: IconEnum;
    onClick: () => void;
  } & Phaser.Types.GameObjects.Text.TextStyle,
) => {
  const iconBtn = googleFont(scene, x, y, {
    icon,
    color: '#ffffff44',
    fontSize: 48,
    origin: 0.5,
    padding: {
      top: 20, // fix chrome cutoff icons, it does not affect position
      left: 20,
      right: 20,
      bottom: 10,
    },
    ...other,
    fontFamily: FontFamilyEnum.ICONS,
  });

  iconBtn.setInteractive({ useHandCursor: true });
  iconBtn.on('pointerdown', onClick);

  return iconBtn;
};

export default iconButton;
