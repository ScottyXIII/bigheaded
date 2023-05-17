import { WEBGL } from "phaser";

import { GameScene } from "@/scenes/game-scene";

const canvas = document.getElementById("game") as HTMLCanvasElement;

export const config = {
  type: WEBGL,
  width: window.innerWidth,
  height: window.innerHeight,
  canvas,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 },
      checkCollision: {
        left: true,
        right: true,
        up: true,
        down: true,
      },
      debug: true,
    },
  },
  scene: [GameScene],
};
