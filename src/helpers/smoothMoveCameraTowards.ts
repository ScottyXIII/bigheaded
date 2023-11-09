import { Scene, GameObjects } from 'phaser';

const smoothMoveCameraTowards = (
  scene: Scene,
  target: GameObjects.Image | undefined,
  smoothFactor = 0,
) => {
  if (!target) return;
  const cam = scene.cameras.main;
  cam.scrollX =
    smoothFactor * cam.scrollX +
    (1 - smoothFactor) * (target.x - cam.width * 0.5);
  cam.scrollY =
    smoothFactor * cam.scrollY +
    (1 - smoothFactor) * (target.y - cam.height * 0.6);
};

export default smoothMoveCameraTowards;
