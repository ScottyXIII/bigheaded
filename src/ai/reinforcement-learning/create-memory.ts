import * as tf from '@tensorflow/tfjs';
import { sampleSize } from 'lodash';

type RecordType = {
  state: tf.Tensor;
  action: number;
};

type SampleType = {
  state: tf.Tensor;
  action: number;
  reward: number;
  nextState: tf.Tensor;
};

const createMemory = (maxLength = 500) => {
  const samples: RecordType[] = [];

  const addSample = (newSample: RecordType) => {
    samples.push(newSample);
    if (samples.length > maxLength) {
      const { state } = samples.shift() || {};
      state?.dispose();
    }
    // console.log('save to memory', newSample, samples);
  };

  const getSamples = (
    nSamples: number,
    calculateReward: Function,
    inputSize: number,
  ) => {
    // convert Records into Samples
    const trainingData = samples.reduce((acc, sample, index) => {
      const { state, action } = sample;
      const nextState = samples[index + 1].state || tf.zeros([inputSize]);
      const reward = calculateReward(nextState.dataSync() as unknown);
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
