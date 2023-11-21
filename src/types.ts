// just like phaser's matter image, but with a body of matter body type
export type PhaserMatterImage = Omit<Phaser.Physics.Matter.Image, 'body'> & {
  body: MatterJS.BodyType;
};
