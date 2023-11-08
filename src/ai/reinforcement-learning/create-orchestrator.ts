import * as tf from '@tensorflow/tfjs';
import Phaser from 'phaser';
import createMemory from './create-memory';
import createNN from './create-nn';
import config from './config';

const { maxEpsilon, minEpsilon, lambda } = config;

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
  const { predict, choose, train } = await createNN({
    indexedDbName: config.indexedDbName,
    layerUnits: config.layerUnits,
  });

  let steps = 0;
  let exploration = maxEpsilon;

  const { addSample, getSamples } = createMemory(config.memoryMaxLength);

  const run = (state: tf.Tensor, nextState: tf.Tensor) => {
    const action = choose(state, exploration);

    // update scene here with action

    // then get next state? probs state = last state?

    const reward = calculateReward(scene);

    addSample({ state, action, reward, nextState });

    steps += 1;

    // Exponentially decay the exploration parameter
    exploration =
      minEpsilon + (maxEpsilon - minEpsilon) * Math.exp(-lambda * steps);

    if (steps >= config.maxStepsPerGame) {
      scene.sys.game.scene.start('scene-game'); // note: this must initialise things in random positions
    }
  };

  const replay = async () => {
    // get random samples from memory
    const batch = getSamples(config.batchSize);

    // convert batch into x y (qsa) values
    const out = batch.map(({ state, action, reward, nextState }) => {
      // Predict the value of historical action for current state
      const currentQ = predict(state) as tf.Tensor;

      // Predict the value of historical action for next state
      const nextQ = predict(nextState) as tf.Tensor;

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

    const x = out.map(({ xValue }) => xValue); // states
    const y = out.map(({ yValue }) => yValue); // actions

    // Learn the Q(s, a) values given associated discounted rewards
    await train(x, y);
  };

  return { run, replay };
};

export default createOrchestrator;
