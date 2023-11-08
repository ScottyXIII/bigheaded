export default {
  indexedDbName: 'megabrain-v0',
  layerUnits: [
    2, // 2 inputs
    128,
    128,
    3, // 3 outputs
  ],
  batchSize: 100,
  memoryMaxLength: 500,
  rewardDiscountRate: 0.95, // between 0 and 1
  minEpsilon: 0.01, // between 0 and 1
  maxEpsilon: 0.2, // between 0 and 1
  lambda: 0.01,
};
