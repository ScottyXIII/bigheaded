const moveTowards = (that, target) => {
  const { x, y } = target;

  // face towards vector
  if (x > this.x) this.facing = 1;
  if (x < this.x) this.facing = -1;

  const { angularVelocity } = this.gameObject.body;
  const speed = Math.hypot(
    this.gameObject.body.velocity.x,
    this.gameObject.body.velocity.y,
  );
  const motion = speed + Math.abs(angularVelocity);
  const closeToStationary = motion <= 0.1;

  if (closeToStationary || this.constantMotion) {
    const vectorTowardsEntity = {
      x: x - this.x,
      y: y - this.y,
    };
    this.gameObject.setVelocity?.(
      vectorTowardsEntity.x < 0 ? -this.maxSpeedX : this.maxSpeedX,
      vectorTowardsEntity.y < 0 ? -this.maxSpeedY : this.maxSpeedY,
    );
  }
};

export default moveTowards;
