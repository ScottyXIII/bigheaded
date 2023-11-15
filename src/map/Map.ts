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
  private scene: Phaser.Scene;

  private level: Phaser.Tilemaps.Tilemap | undefined;

  private layers: LayersObjType = {};

  public spawners: SpawnersObjType = {};

  static preload(scene: Phaser.Scene, mapConfig: MapConfigType) {
    scene.load.image('tileSheet', mapConfig.tilesetPng);
    scene.load.tilemapTiledJSON('level1', mapConfig.tiledMapJson);
  }

  constructor(scene: Phaser.Scene, mapConfig: MapConfigType) {
    this.scene = scene;

    // load map
    this.level = this.scene.make.tilemap({ key: 'level1' });
    this.level.addTilesetImage(
      'tiles',
      'tileSheet',
      mapConfig.tileWidth,
      mapConfig.tileHeight,
      mapConfig.tileMargin,
      mapConfig.tileSpacing,
    );

    // load layers
    this.layers = mapConfig.layerConfig.reduce(
      (acc, { tiledLayerName, depth, collisionCategory }) => {
        const layer = this.level?.createLayer(tiledLayerName, 'tiles');
        layer
          .setCollisionByProperty({ collides: !!collisionCategory })
          .setDepth(depth);

        this.scene.matter.world.convertTilemapLayer(layer);

        layer.forEachTile(tile => {
          tile.physics.matterBody?.setCollisionCategory?.(collisionCategory);
        });
        return { ...acc, [tiledLayerName]: layer };
      },
      {},
    );

    // for each entry in the spawnerConfig, create a group
    this.spawners = mapConfig.spawnerConfig.reduce(
      (acc, { tiledObjectName, classType, maxSize, runChildUpdate }) => {
        const group = this.scene.add.group({
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

    console.log(this.spawners);

    // const { x, y } = this.map.filterObjects(
    //   'Spawner',
    //   obj => obj.name === tiledObjectName,
    // ) || { x: 0, y: 0 };

    // set the world boundry same size as background
    const { x, y, width, height } = this.layers.background;
    this.scene.matter.world.setBounds(x, y, width, height);
  }

  // update(time: number, delta: number) {}
}

export default Map;
