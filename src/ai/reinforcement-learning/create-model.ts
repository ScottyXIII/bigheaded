import * as tf from '@tensorflow/tfjs';
import createNN from './create-nn';

const createModel = async ({
  indexedDbName = 'testnn-v0',
  layerUnits = [2, 6, 6, 3],
}) => {
  const modelSavePath = `indexeddb://${indexedDbName}`;
  const inputSize = layerUnits[0];
  const outputSize = layerUnits[layerUnits.length - 1];

  // load model from indexeddb or create a new one
  const modelsInfo = await tf.io.listModels();
  const network =
    modelSavePath in modelsInfo
      ? await tf.loadLayersModel(modelSavePath)
      : createNN(layerUnits);

  const predict = (states: tf.Tensor | tf.Tensor[]) =>
    tf.tidy(() => network.predict(states));

  const choose = (state: tf.Tensor, eps: number) => {
    // if decayed
    if (Math.random() < eps) {
      // behave randomly
      return Math.floor(Math.random() * outputSize) - 1; // -1, 0 or 1
    }

    // else use NN to predict next action
    return tf.tidy(() => {
      const logits = predict(state);
      // @ts-ignore
      const sigmoid = tf.sigmoid(logits);
      const probs = tf.div(sigmoid, tf.sum(sigmoid));
      // @ts-ignore
      return tf.multinomial(probs, 1).dataSync()[0] - 1; // -1, 0 or 1
    });
  };

  const train = async (x: number[], y: number[]) => {
    // Reshape the batches to be fed to the network
    const xBatch = tf.tensor2d(x, [x.length, inputSize]);
    const yBatch = tf.tensor2d(y, [y.length, outputSize]);

    // train the network
    await network.fit(xBatch, yBatch);

    // free up gpu memory
    xBatch.dispose();
    yBatch.dispose();
  };

  const save = async () => network.save(modelSavePath);

  const remove = async () => tf.io.removeModel(modelSavePath);

  return {
    network,
    inputSize,
    predict,
    choose,
    train,
    save,
    remove,
  };
};

export default createModel;
