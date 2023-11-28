import SettingsHud from '@/overlays/SettingsHud';
import useLocalStorage from './useLocalStorage';

const { getValue: getIsDebugOn, setValue } = useLocalStorage('isDebugOn', true);

const initDebug = (scene: Phaser.Scene, settingsHud: SettingsHud) => {
  const mouseSpring =
    scene.matter.add.mouseSpring() as unknown as Phaser.Physics.Matter.PointerConstraint;

  const setIsDebugOn = (newIsDebugOn: boolean) => {
    // save to local storage
    setValue(newIsDebugOn);

    // set matter debug shapes
    scene.matter.world.drawDebug = newIsDebugOn;
    scene.matter.world.debugGraphic.clear();

    // set mouse spring
    mouseSpring.active = newIsDebugOn;

    // set the settings menu debug hitAreas on / off
    settingsHud.setHitAreaDebug(newIsDebugOn);

    // set EYE button state
    settingsHud.setButtonState('isDebugOn', newIsDebugOn);
  };

  const toggleDebug = () => {
    const isDebugOn = getIsDebugOn();
    const newIsDebugOn = !isDebugOn;
    setIsDebugOn(newIsDebugOn);
  };

  // when phaser loads in dev mode
  // the matter drawDebug will be true by default
  // and button hitareas will not be displayed
  // on init we need to sync those with LS value
  const isDebugOn = getIsDebugOn(); // value from LS
  setIsDebugOn(isDebugOn);

  scene.input.keyboard?.on('keydown-HOME', () => toggleDebug());

  return { getIsDebugOn, setIsDebugOn, toggleDebug };
};

export default initDebug;
