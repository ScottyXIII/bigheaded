import isDev from '@/helpers/isDev';
import useLocalStorage from './useLocalStorage';

const { getValue: getIsDebugOn, setValue } = useLocalStorage('isDebugOn', true);

const initDebug = (scene: Phaser.Scene) => {
  if (!isDev) return undefined;

  const mouseSpring =
    scene.matter.add.mouseSpring() as unknown as Phaser.Physics.Matter.PointerConstraint;

  const setIsDebugOn = (newIsDebugOn: boolean) => {
    setValue(newIsDebugOn);

    scene.matter.world.drawDebug = newIsDebugOn;
    scene.matter.world.debugGraphic.clear();
    mouseSpring.active = newIsDebugOn;
  };

  const toggleDebug = () => {
    const isDebugOn = getIsDebugOn();
    setIsDebugOn(!isDebugOn);
  };

  // when phaser loads in dev mode, the drawDebug will be true by default
  // on init we need to sync that with LS value
  const isDebugOn = getIsDebugOn(); // value from LS
  setIsDebugOn(isDebugOn);

  scene.input.keyboard?.on('keydown-CTRL', () => toggleDebug());

  return { getIsDebugOn, setIsDebugOn, toggleDebug };
};

export default initDebug;
