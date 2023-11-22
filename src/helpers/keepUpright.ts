import { PhaserMatterImage } from '@/types';

export enum KeepUprightStratergies {
  NONE = 'NONE',
  INSTANT = 'INSTANT',
  SPRINGY = 'SPRINGY',
}

// const instant = (gameObject: Phaser.Physics.Matter.Image) => {
//   if (!gameObject.body) return;
//   if (gameObject.body.inertia !== Infinity) {
//     // save the old inertia
//     gameObject.body.inertia_old = gameObject.body.inertia;
//     gameObject.body.inverseInertia_old = gameObject.body.inverseInertia;
//     gameObject.setAngularVelocity(0);
//     gameObject.rotation = 0;
//     gameObject.setFixedRotation();
//   }
// };

const springy = (gameObject: PhaserMatterImage) => {
  const twoPi = Math.PI * 2;
  const { angle, angularVelocity } = gameObject.body;
  gameObject.rotation %= twoPi; // modulo spins
  const diff = 0 - angle;
  const newAv = angularVelocity + diff / 100;
  gameObject.setAngularVelocity(newAv);
};

// const none = (gameObject: Phaser.Physics.Matter.Image) => {
//   if (!gameObject.body) return;
//   if (gameObject.body.inertia_old && gameObject.body.inverseInertia_old) {
//     gameObject.body.inertia = gameObject.body.inertia_old;
//     gameObject.body.inverseInertia = gameObject.body.inverseInertia_old;
//     delete gameObject.body.inertia_old;
//     delete gameObject.body.inverseInertia_old;
//   }
// };

const keepUpright = (
  stratergy: KeepUprightStratergies,
  gameObject: PhaserMatterImage,
) => {
  if (stratergy === KeepUprightStratergies.SPRINGY) {
    springy(gameObject);
  }

  // if (stratergy === KeepUprightStratergies.INSTANT) {
  //   instant(gameObject);
  // }

  // if (stratergy === KeepUprightStratergies.NONE) {
  //   none(gameObject);
  // }
};

export default keepUpright;
