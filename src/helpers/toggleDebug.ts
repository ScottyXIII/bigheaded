import { Scene } from 'phaser';

const toggleDebug = (scene: Scene) => {
  scene.matter.world.drawDebug = !scene.matter.world.drawDebug;
  scene.matter.world.debugGraphic.clear();
};

export default toggleDebug;
