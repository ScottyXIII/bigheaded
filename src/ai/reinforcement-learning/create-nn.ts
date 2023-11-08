import * as tf from '@tensorflow/tfjs';

// create a simple dense keras NN
// layerUnits:
//   2 inputs
//   6 units in first layer
//   6 units in second layer
//   3 outputs
//
// const network = createNN('testnn-v0', [2, 128, 128, 3]);

const createNN = (indexedDbName = 'testnn-v0', layerUnits = [2, 6, 6, 3]) => {
  const modelSavePath = `indexeddb://${indexedDbName}`;
  const inputSize = layerUnits[0];
  const outputSize = layerUnits[layerUnits.length - 1];
  const layerSizes = layerUnits.slice(1);

  const inputShape = [inputSize];

  const layers = layerSizes.reduce((acc: tf.layers.Layer[], units, index) => {
    const isFirst = index === 0;
    const isLast = index === layerSizes.length - 1;
    return [
      ...acc,
      tf.layers.dense({
        ...(isFirst && { inputShape }),
        units,
        ...(!isLast && { activation: 'relu' }),
      }),
    ];
  }, []);

  const network = tf.sequential({ layers });

  network.summary();
  network.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

  const predict = (states: tf.Tensor | tf.Tensor[]) =>
    tf.tidy(() => network.predict(states));

  const train = async (xBatch: tf.Tensor[], yBatch: tf.Tensor[]) => {
    await network.fit(xBatch, yBatch);
  };

  const save = async () => network.save(modelSavePath);

  const load = async () => {
    const modelsInfo = await tf.io.listModels();
    if (modelSavePath in modelsInfo) {
      console.log(`Loading existing model...`);
      const model = await tf.loadLayersModel(modelSavePath);
      console.log(`Loaded model from ${modelSavePath}`);
      // return new SaveablePolicyNetwork(model);
    } else {
      throw new Error(`Cannot find model at ${modelSavePath}.`);
    }
  };

  return { inputSize, outputSize, network, predict, train, save, load };
};

export default createNN;
