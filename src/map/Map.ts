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

type SpawnersObjType = Record<
  string,
  {
    group: Phaser.GameObjects.Group;
    x: number;
    y: number;
  }
>;

class Map {
  private scene: Phaser.Scene;

  private map: Phaser.Tilemaps.Tilemap | undefined; // TODO: dont call it map, as to not confuse with .map() array proto

  public spawners: SpawnersObjType = {};

  static preload(scene: Phaser.Scene, mapConfig: MapConfigType) {
    scene.load.image('tileSheet', mapConfig.tilesetPng);
    scene.load.tilemapTiledJSON('level1', mapConfig.tiledMapJson);
  }

  constructor(scene: Phaser.Scene, mapConfig: MapConfigType) {
    this.scene = scene;

    // TODO: load map here

    // for each entry in the spawnerConfig, create a group
    this.spawners = mapConfig.spawnerConfig.reduce(
      (acc, { tiledObjectName, classType, maxSize, runChildUpdate }) => {
        if (!this.map) return acc;

        const group = this.scene.add.group({
          maxSize,
          classType,
          runChildUpdate,
        });
        const { x, y } = this.map.findObject(
          'Spawner',
          obj => obj.name === tiledObjectName,
        ) || { x: 0, y: 0 };

        return {
          ...acc,
          [tiledObjectName]: { group, x, y },
        };
      },
      {},
    );

    console.log(this.spawners);

    const { x, y, width, height } = this.layers.background;

    this.scene.matter.world.setBounds(x, y, width, height);
  }

  update(time: number, delta: number) {}
}

export default Map;
