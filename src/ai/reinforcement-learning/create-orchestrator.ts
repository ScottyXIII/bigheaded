import * as tf from '@tensorflow/tfjs';
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
  calculateState: Function,
  calculateReward: Function,
  restartScene: Function,
) => {
  const { network, inputSize, predict, choose, train } = await createModel({
    indexedDbName,
    layerUnits,
  });

  let steps = 0;
  let exploration = maxEpsilon;

  const { addSample, getSamples } = createMemory(memoryMaxLength);

  const run = () => {
    const inputs = calculateState();
    const state = tf.tensor2d([inputs]);

    const action = choose(state, exploration);

    addSample({ state, action });

    steps += 1;

    // Exponentially decay the exploration parameter
    exploration =
      minEpsilon + (maxEpsilon - minEpsilon) * Math.exp(-lambda * steps);

    if (steps >= maxStepsPerGame) {
      restartScene();

      steps = 0;
      // TODO: save and reset memory
    }

    return action;
  };

  const replay = async () => {
    // get random samples from memory
    const batch = getSamples(batchSize, calculateReward, inputSize);

    const totalReward = batch.reduce((acc, { reward }) => acc + reward, 0);
    console.log('totalReward', totalReward);

    // convert batch into x y (qsa) values
    const out = batch.map(({ state, action, reward, nextState }) => {
      // console.log({ action, reward });

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
    console.log('train', network);
    await train(x, y);
  };

  return { run, replay };
};

export default createOrchestrator;
