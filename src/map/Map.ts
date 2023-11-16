import Phaser from 'phaser';

type LayerConfigType = {
  tiledLayerName: string;
  depth: number;
  collisionCategory: number | undefined;
};

type SpawnerConfigType = {
  tiledObjectName: string;
  classType: any;
  maxSize: number;
  runChildUpdate: boolean;
  autoSpawn: boolean;
};

type MapConfigType = {
  tilesetPng: string;
  tiledMapJson: string;
  tileWidth: number;
  tileHeight: number;
  tileMargin: number;
  tileSpacing: number;
  layerConfig: LayerConfigType[];
  spawnerConfig: SpawnerConfigType[];
};

type LayersObjType = Record<string, Phaser.Tilemaps.TilemapLayer>;

type SpawnersObjType = Record<string, Phaser.GameObjects.Group>;

class Map {
  private level: Phaser.Tilemaps.Tilemap | undefined;

  private layers: LayersObjType = {};

  public spawners: SpawnersObjType = {};

  static preload(scene: Phaser.Scene, mapConfig: MapConfigType) {
    scene.load.image('tileSheet', mapConfig.tilesetPng);
    scene.load.tilemapTiledJSON('level1', mapConfig.tiledMapJson);
  }

  constructor(scene: Phaser.Scene, mapConfig: MapConfigType) {
    const {
      tileWidth,
      tileHeight,
      tileMargin,
      tileSpacing,
      layerConfig,
      spawnerConfig,
    } = mapConfig;

    // load map
    this.level = scene.make.tilemap({ key: 'level1' });
    this.level.addTilesetImage(
      'tiles',
      'tileSheet',
      tileWidth,
      tileHeight,
      tileMargin,
      tileSpacing,
    );

    // load image layers
    this.layers = layerConfig.reduce(
      (acc, { tiledLayerName, depth, collisionCategory }) => {
        const layer = this.level?.createLayer(tiledLayerName, 'tiles');

        if (!layer) return acc;

        layer
          .setCollisionByProperty({ collides: !!collisionCategory })
          .setDepth(depth);

        return { ...acc, [tiledLayerName]: layer };
      },
      {},
    );

    // load staticbodies
    // - in Tiled bodies must be polygons
    // - in Tiled bodies must not be convex
    // - in Tiled bodies must be drawn starting from top left corner
    // if these rules are not followed, the map will break or shapes will be wrong
    const staticbodies =
      this.level.getObjectLayer('staticbodies')?.objects || [];
    for (let i = 0; i < staticbodies.length; i += 1) {
      const { x, y, polygon } = staticbodies[i];
      const poly = scene.add.polygon(0, 0, polygon, 0x0000ff, 0.5);
      const mb = scene.matter.add.gameObject(poly, {
        shape: { type: 'fromVerts', verts: polygon, flagInternal: true },
        isStatic: true,
        position: { x, y },
      }) as Phaser.Physics.Matter.Image;

      mb.x += mb.width / 2;
      mb.y += mb.height / 2;
    }

    // for each entry in the spawnerConfig, create a group
    this.spawners = spawnerConfig.reduce(
      (acc, { tiledObjectName, classType, maxSize, runChildUpdate }) => {
        const group = scene.add.group({
          maxSize,
          classType,
          runChildUpdate,
        });

        return {
          ...acc,
          [tiledObjectName]: group,
        };
      },
      {},
    );

    // set the world boundry same size as background
    const { x, y, width, height } = this.layers.solidground;
    scene.matter.world.setBounds(x, y, width, height, 1024);
  }

  // update(time: number, delta: number) {}
}

export default Map;
