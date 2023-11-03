import Phaser, { Scene } from 'phaser';
import createMemory from './create-memory';
import createNN from './create-nn';

const createOrchestrator = (scene: Phaser.Scene) => {
  const { samples, addSample } = createMemory();
  const model = createNN();
  scene.restart();

  return { samples, addSample, model };
};

export default createOrchestrator;
