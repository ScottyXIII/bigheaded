import * as tf from '@tensorflow/tfjs';
import Phaser from 'phaser';
import createMemory from './create-memory';
import createNN from './create-nn';

const config = {
  indexedDbName: 'megabrain-v0',
  layerUnits: [2, 128, 128, 3], // 2 inputs, 3 outputs
  batchSize: 100,
  memoryMaxLength: 500,
  rewardDiscountRate: 0.95, // between 0 and 1
  minEpsilon: 0.01, // between 0 and 1
  maxEpsilon: 0.2, // between 0 and 1
  lambda: 0.01,
};

const createOrchestrator = async (
  scene: Phaser.Scene,
  calculateReward: Function,
) => {
  const { inputSize, outputSize, network, train } = await createNN({
    indexedDbName: config.indexedDbName,
    layerUnits: config.layerUnits,
  });

  const { samples, addSample, getSamples } = createMemory(
    config.memoryMaxLength,
  );

  scene.sys.game.scene.start('scene-game');

  calculateReward(scene);

  const replay = async () => {
    // get random samples from memory
    const batch = getSamples(config.batchSize);

    // Predict the values of each action at each state
    const qsa = batch.map(({ state }) => network.predict(state) as tf.Tensor);

    // Predict the values of each action at each next state
    const qsad = batch.map(
      ({ nextState }) => network.predict(nextState) as tf.Tensor,
    );

    const x: tf.TensorLike = [];
    const y: tf.TensorLike = [];

    // Update the states rewards with the discounted next states rewards
    batch.forEach(({ state, action, reward, nextState }, index) => {
      const currentQ = qsa[index];
      currentQ[action] = nextState
        ? reward + config.rewardDiscountRate * qsad[index].max().dataSync()
        : reward;
      x.push(state.dataSync());
      y.push(currentQ.dataSync());
    });

    // Clean unused tensors
    qsa.forEach(state => state.dispose());
    qsad.forEach(state => state.dispose());

    // Reshape the batches to be fed to the network
    const xBatch = tf.tensor2d(x, [x.length, inputSize]);
    const yBatch = tf.tensor2d(y, [y.length, outputSize]);

    // Learn the Q(s, a) values given associated discounted rewards
    await train(xBatch, yBatch);

    xBatch.dispose();
    yBatch.dispose();
  };

  return { samples, addSample, replay };
};

export default createOrchestrator;

// const orch = createOrchestrator(this.scene, () => {
//   if (position >= 0.5) {
//     return 100;
//   }
//   if (position >= 0.25) {
//     return 20;
//   }
//   if (position >= 0.1) {
//     return 10;
//   }
//   if (position >= 0) {
//     return 5;
//   }
//   return 0;
// });
