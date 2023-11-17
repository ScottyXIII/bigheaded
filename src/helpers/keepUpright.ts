import * as Phaser from 'phaser';

// @ts-ignore
const { setAngularVelocity } = Phaser.Physics.Matter.Matter.Body;
const twoPi = Math.PI * 2;

const keepUpright = (
  entity: Phaser.GameObjects.GameObject['body'],
  { multiplier = 0.01, avDampener = 0.95 } = {},
) => {
  if (!entity) return;
  const { body } = entity.gameObject;

  // eslint-disable-next-line no-param-reassign
  entity.gameObject.rotation %= twoPi; // modulo spins

  const { angle, angularVelocity } = body;
  const avDamped = angularVelocity * avDampener;
  const diff = 0 - angle;
  const newAv = avDamped + diff * multiplier;

  const isASmallAdjustment = Math.abs(newAv) < 0.01;
  const isCloseToVertical = Math.abs(entity.gameObject.rotation) < 0.05;
  if (isASmallAdjustment && isCloseToVertical) {
    // eslint-disable-next-line no-param-reassign
    entity.gameObject.rotation = 0;
    setAngularVelocity(body, 0);
  } else {
    setAngularVelocity(body, newAv);
  }
};

export default keepUpright;
