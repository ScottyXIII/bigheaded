import { Scene } from 'phaser';

const toggleDebug = (scene: Scene) => {
  // eslint-disable-next-line no-param-reassign
  scene.matter.world.drawDebug = !scene.matter.world.drawDebug;
  scene.matter.world.debugGraphic.clear();
};

export default toggleDebug;
