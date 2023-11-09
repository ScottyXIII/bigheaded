import * as tf from '@tensorflow/tfjs';
import { sampleSize } from 'lodash';

type RecordType = {
  state: tf.Tensor;
  action: number;
};

type SampleType = {
  state: tf.Tensor;
  action: number;
  nextState: tf.Tensor;
  reward: number;
};

const createMemory = (maxLength = 500) => {
  const samples: RecordType[] = [];

  const addSample = (newSample: RecordType) => {
    samples.push(newSample);
    if (samples.length > maxLength) {
      const { state } = samples.shift() || {};
      state?.dispose();
    }
  };

  const getSamples = (nSamples: number, calculateReward: Function) => {
    // convert Records into Samples
    const trainingData = samples.reduce((acc, sample) => {
      const { state, action } = sample;
      const nextState = state; // TODO
      const reward = calculateReward(nextState);
      const newSample = { state, action, reward, nextState };
      return [...acc, newSample];
    }, [] as SampleType[]);

    // return randomised samples
    return sampleSize(trainingData, nSamples);
  };

  return {
    addSample,
    getSamples,
  };
};

export default createMemory;
