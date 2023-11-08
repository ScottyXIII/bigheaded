import * as tf from '@tensorflow/tfjs';
import Phaser from 'phaser';
import createMemory from './create-memory';
import createNN from './create-nn';
import config from './config';

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

const createOrchestrator = async (
  scene: Phaser.Scene,
  calculateReward: Function,
) => {
  const { network, train } = await createNN({
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

    // convert batch into x y values
    const out = batch.map(({ state, action, reward, nextState }) => {
      // Predict the value of historical action for current state
      const currentQ = network.predict(state) as tf.Tensor;

      // Predict the value of historical action for next state
      const nextQ = network.predict(nextState) as tf.Tensor;

      const value = nextQ.max().dataSync() as unknown as number;

      // Update the states rewards with the discounted next states rewards
      const discountedReward = reward + config.rewardDiscountRate * value;

      // @ts-expect-error
      currentQ[action] = discountedReward; // seems a bit weird?

      // extract values
      const xValue = state.dataSync() as unknown as number; // state
      const yValue = currentQ.dataSync() as unknown as number; // action

      // free up gpu memory
      currentQ.dispose();
      nextQ.dispose();

      return {
        xValue,
        yValue,
      };
    });

    const x = out.map(({ xValue }) => xValue);
    const y = out.map(({ yValue }) => yValue);

    // Learn the Q(s, a) values given associated discounted rewards
    await train(x, y);
  };

  return { samples, addSample, replay };
};

export default createOrchestrator;
