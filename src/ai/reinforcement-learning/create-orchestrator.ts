import Phaser from 'phaser';
import createMemory from './create-memory';
import createNN from './create-nn';

const MIN_EPSILON = 0.01;
const MAX_EPSILON = 0.2;
const LAMBDA = 0.01;

const createOrchestrator = (scene: Phaser.Scene, calculateReward: Function) => {
  const { samples, addSample } = createMemory();

  scene.sys.game.scene.start('scene-game');

  calculateReward(scene);

  return { samples, addSample };
};

export default createOrchestrator;

const orch = createOrchestrator(this.scene, () => {
  if (position >= 0.5) {
    return 100;
  }
  if (position >= 0.25) {
    return 20;
  }
  if (position >= 0.1) {
    return 10;
  }
  if (position >= 0) {
    return 5;
  }
  return 0;
});
