// https://github.com/photonstorm/phaser/issues/6178
const convertTiledPolygonToGameObject = (
  scene: Phaser.Scene,
  { x, y, polygon },
) => {
  const body = scene.matter.add.fromVertices(x, y, polygon, { isStatic: true });
  const { x: bx, y: by } = body.position;
  const { x: cx, y: cy } = body.centerOffset;
  const polyVerts = body.vertices.map(({ x: vx, y: vy }) => ({
    x: vx - bx + cx,
    y: vy - by + cy,
  }));
  const poly = scene.add.polygon(bx, by, polyVerts, 0, 0);
  return scene.matter.add
    .gameObject(poly, body, false)
    .setPosition(cx + x, cy + y);
};

export default convertTiledPolygonToGameObject;
