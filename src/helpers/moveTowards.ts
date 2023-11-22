import Entity from '@/objects/entities/Entity';

export type MoveOptionsType = {
  constantMotion: boolean;
  maxSpeedX: number;
  maxSpeedY: number;
};

// defaults
// constantMotion: false,
// maxSpeedY: 2,
// maxSpeedX: 2,

const moveTowards = (
  that: Entity,
  target: Entity | undefined,
  moveOptions: MoveOptionsType,
) => {
  if (!target) return;

  const { x, y } = target;

  // face towards vector
  if (x > that.x) that.facing = 1;
  if (x < that.x) that.facing = -1;

  const { angularVelocity } = that.gameObject.body;
  const speed = Math.hypot(
    that.gameObject.body.velocity.x,
    that.gameObject.body.velocity.y,
  );
  const motion = speed + Math.abs(angularVelocity);
  const closeToStationary = motion <= 0.1;

  if (closeToStationary || moveOptions.constantMotion) {
    const vectorTowardsEntity = {
      x: x - that.x,
      y: y - that.y,
    };
    that.gameObject.setVelocity?.(
      vectorTowardsEntity.x < 0
        ? -moveOptions.maxSpeedX
        : moveOptions.maxSpeedX,
      vectorTowardsEntity.y < 0
        ? -moveOptions.maxSpeedY
        : moveOptions.maxSpeedY,
    );
  }
};

export default moveTowards;
