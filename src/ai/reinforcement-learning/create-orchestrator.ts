import Phaser from 'phaser';
import createMemory from './create-memory';
import createNN from './create-nn';

const createOrchestrator = (scene: Phaser.Scene) => {
  const { samples, addSample } = createMemory();
  const model = createNN();

  scene.sys.game.scene.start('scene-game');

  return { samples, addSample, model };
};

export default createOrchestrator;
