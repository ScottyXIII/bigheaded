import { bodyToCC } from '@/enums/CollisionCategories';

// take bodyA and bodyB collision data
// find the collisionCategory for each body
// arrange new object, with bodies grouped into collisionCategories
const prepareCollisionData = (
  data: Phaser.Types.Physics.Matter.MatterCollisionData,
) => {
  const newData = [
    {
      body: data.bodyA,
      cc: bodyToCC(data.bodyA),
    },
    {
      body: data.bodyB,
      cc: bodyToCC(data.bodyB),
    },
  ].reduce(
    (acc, bodyData) => ({
      ...acc,
      [bodyData.cc]: [
        ...(acc[bodyData.cc] ? acc[bodyData.cc] : []), // bodies already in this category
        bodyData.body, // add current body to array
      ],
    }),
    {} as Record<string, MatterJS.BodyType[]>,
  );
  return newData;
};

export default prepareCollisionData;
