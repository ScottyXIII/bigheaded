import { WEBGL } from "phaser";

import GameScene from "@scenes/game-scene";

const canvas = document.getElementById("game") as HTMLCanvasElement;

export const config = {
  type: WEBGL,
  width: window.innerWidth,
  height: window.innerHeight,
  canvas,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      // debug: true
    },
  },
  scene: [GameScene],
};
