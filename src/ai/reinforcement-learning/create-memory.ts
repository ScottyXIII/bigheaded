import * as tf from '@tensorflow/tfjs';

type SampleType = {
  state: tf.Tensor;
  action: number;
  reward: number;
  nextState: tf.Tensor;
};

const maxLength = 500;

const samples: SampleType[] = [];

const addSample = (newSample: SampleType) => {
  samples.push(newSample);
  if (samples.length > maxLength) {
    const { state, nextState } = samples.shift() || {};
    state?.dispose();
    nextState?.dispose();
  }
};

export {
  samples, // singleton
  addSample,
};
