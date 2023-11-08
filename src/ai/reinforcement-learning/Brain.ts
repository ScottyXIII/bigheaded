import * as tf from '@tensorflow/tfjs';
import createNN from '@/ai/reinforcement-learning/create-nn';

class Brain {
  public network: tf.Sequential;

  private numActions: number;

  constructor(layerUnits: number[]) {
    this.network = createNN(layerUnits);
    this.numActions = layerUnits[layerUnits.length - 1];
  }
}

export default Brain;
