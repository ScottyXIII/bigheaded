import * as tf from '@tensorflow/tfjs';

// create a simple dense keras NN
// layerUnits:
// 2 inputs
// 6 units in first layer
// 6 units in second layer
// 3 outputs
const createNN = (layerUnits = [2, 6, 6, 3]) => {
  const inputShape = [layerUnits[0]];
  const layerSizes = layerUnits.slice(1);
  const layers = layerSizes.reduce((acc: tf.layers[], units, index) => {
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

  return {
    network,
  };
};

export default createNN;

// const { network } = createNN([2,128,128,3]);
