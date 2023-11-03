import * as tf from '@tensorflow/tfjs';

type SampleType = {
  state: tf.Tensor;
  action: number;
  reward: number;
  nextState: tf.Tensor;
};

const createMemory = (maxLength = 500) => {
  const samples: SampleType[] = [];

  const addSample = (newSample: SampleType) => {
    samples.push(newSample);
    if (samples.length > maxLength) {
      const { state, nextState } = samples.shift() || {};
      state?.dispose();
      nextState?.dispose();
    }
  };
  return {
    samples,
    addSample,
  };
};

export default createMemory;

// const memory = createMemory(400);
