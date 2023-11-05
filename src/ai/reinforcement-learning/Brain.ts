import * as tf from '@tensorflow/tfjs';
import createNN from '@/ai/reinforcement-learning/create-nn';

class Brain {
  public network: tf.Sequential;

  private numActions: number;

  constructor(layerUnits: number[]) {
    this.network = createNN(layerUnits);
    this.numActions = layerUnits[layerUnits.length - 1];
  }

  async train(
    xBatch: tf.Tensor | tf.Tensor[],
    yBatch: tf.Tensor | tf.Tensor[],
  ) {
    await this.network.fit(xBatch, yBatch);
  }

  predict(states: tf.Tensor | tf.Tensor[]) {
    return tf.tidy(() => this.network.predict(states));
  }

  choose(state: tf.Tensor, eps: number) {
    // if decayed behave randomly
    if (Math.random() < eps) {
      return Math.floor(Math.random() * this.numActions) - 1;
    }

    // else use NN to predict next action
    return tf.tidy(() => {
      const logits = this.predict(state);
      // @ts-ignore
      const sigmoid = tf.sigmoid(logits);
      const probs = tf.div(sigmoid, tf.sum(sigmoid));
      // @ts-ignore
      return tf.multinomial(probs, 1).dataSync()[0] - 1;
    });
  }
}

export default Brain;
