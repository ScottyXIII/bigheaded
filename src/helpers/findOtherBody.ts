const findOtherBody = (
  thisSensorId: number,
  collisionData: MatterJS.ICollisionPair,
) => {
  const bodies = [collisionData.bodyA, collisionData.bodyB];
  // @ts-expect-error id does exist!
  const other = bodies.find(({ id }) => id !== thisSensorId);
  return other;
};

export default findOtherBody;
