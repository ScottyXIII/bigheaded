import * as Phaser from 'phaser';
import keepUprightStratergies from '@/objects/Enums/Physics';

const instant = (gameObject: Phaser.GameObjects.GameObject) => {
  if (gameObject.body.inertia !== Infinity) {
    // save the old inertia
    gameObject.body.inertia_old = gameObject.body.inertia;
    gameObject.body.inverseInertia_old = gameObject.body.inverseInertia;
    gameObject.setAngularVelocity(0);
    gameObject.rotation = 0;
    gameObject.setFixedRotation();
  }
};

const springy = (gameObject: Phaser.GameObjects.GameObject) => {
    const twoPi = Math.PI * 2;
    const { angle, angularVelocity } = gameObject.body;
    gameObject.rotation %= twoPi; // modulo spins
    const diff = 0 - angle;
    const newAv = angularVelocity + (diff / 100);
    gameObject.setAngularVelocity(newAv);
};

const none = (gameObject: Phaser.GameObjects.GameObject) => {
  console.log("none");
  if (gameObject.body.inertia_old && gameObject.body.inverseInertia_old) {
    gameObject.body.inertia = gameObject.body.inertia_old;
    gameObject.body.inverseInertia = gameObject.body.inverseInertia_old;
    delete gameObject.body.inertia_old;
    delete gameObject.body.inverseInertia_old;
  }
};

const keepUprightStratergy = (stratergy: keepUprightStratergies, gameObject) => {
  if (stratergy === keepUprightStratergies.SPRINGY) {
    springy(gameObject);
  }

  if (stratergy === keepUprightStratergies.INSTANT) {
    instant(gameObject);
  }

  if (stratergy === keepUprightStratergies.NONE) {
    none(gameObject);
  }
};

export default keepUprightStratergy;
