import { PhaserMatterImage } from '@/types';

type ConvertOptions = {
  x: number;
  y: number;
  polygon: Phaser.Types.Math.Vector2Like[];
};

// https://github.com/photonstorm/phaser/issues/6178
const convertTiledPolygonToGameObject = (
  scene: Phaser.Scene,
  { x, y, polygon }: ConvertOptions,
) => {
  const body = scene.matter.add.fromVertices(x, y, polygon, { isStatic: true });
  if (!body.vertices) return undefined;
  const { x: bx, y: by } = body.position;
  const { x: cx, y: cy } = body.centerOffset;
  const polyVerts = body.vertices.map(({ x: vx, y: vy }) => ({
    x: vx - bx + cx,
    y: vy - by + cy,
  }));
  const poly = scene.add.polygon(bx, by, polyVerts, 0, 0);
  const gameObject = scene.matter.add.gameObject(
    poly,
    body,
    false,
  ) as PhaserMatterImage;
  gameObject.name = 'staticbody';
  gameObject.setPosition(cx + x, cy + y);
  return gameObject;
};

export default convertTiledPolygonToGameObject;
