import * as tf from '@tensorflow/tfjs';
import Phaser from 'phaser';
import createModel from './create-model';
import createMemory from './create-memory';
import config from './config';

const {
  indexedDbName,
  layerUnits,
  batchSize,
  memoryMaxLength,
  maxStepsPerGame,
  rewardDiscountRate,
  maxEpsilon,
  minEpsilon,
  lambda,
} = config;

const createOrchestrator = async (
  scene: Phaser.Scene,
  calculateState: Function,
  calculateReward: Function,
) => {
  const { predict, choose, train } = await createModel({
    indexedDbName,
    layerUnits,
  });

  let steps = 0;
  let exploration = maxEpsilon;

  const { addSample, getSamples } = createMemory(memoryMaxLength);

  const run = (state: tf.Tensor, nextState: tf.Tensor) => {
    const action = choose(state, exploration);

    // TODO: update scene here with action

    // then get next state? probs state = last state?

    const reward = calculateReward(scene);

    addSample({ state, action, reward, nextState });

    steps += 1;

    // Exponentially decay the exploration parameter
    exploration =
      minEpsilon + (maxEpsilon - minEpsilon) * Math.exp(-lambda * steps);

    if (steps >= maxStepsPerGame) {
      scene.sys.game.scene.start('scene-game'); // note: this must initialise things in random positions
    }
  };

  const replay = async () => {
    // get random samples from memory
    const batch = getSamples(batchSize);

    // convert batch into x y (qsa) values
    const out = batch.map(({ state, action, reward, nextState }) => {
      // Predict the value of historical action for current state
      const currentQ = predict(state) as tf.Tensor;

      // Predict the value of historical action for next state
      const nextQ = predict(nextState) as tf.Tensor;

      // get some weird max value from next
      const value = nextQ.max().dataSync() as unknown as number;

      // Update the states rewards with the discounted next states rewards
      const discountedReward = reward + rewardDiscountRate * value;

      // @ts-expect-error
      currentQ[action] = discountedReward; // seems a bit weird?

      // extract values from state and action
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
