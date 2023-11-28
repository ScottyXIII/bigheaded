const findOtherBody = (
  thisSensorId: number | undefined,
  collisionData: Phaser.Types.Physics.Matter.MatterCollisionData,
) => {
  const bodies = [collisionData.bodyA, collisionData.bodyB];
  const other = bodies.find(({ id }) => id !== thisSensorId);
  return other;
};

export default findOtherBody;
