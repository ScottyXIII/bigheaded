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
  tiledMapJson: string;
  tilesetPng: string;
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

  public layers = {};

  public layers2: Layer[] = [];

  public spawners: SpawnersObjType = {};

  static preload(
    scene: Phaser.Scene,
    tileSheet = 'tileset.png',
    mapData = 'mapData.json',
  ) {
    scene.load.image(TILE_SHEET_KEY, getFilePath(tileSheet));
    scene.load.tilemapTiledJSON(ROOT_MAP_FOLDER, getFilePath(mapData));
  }

  constructor(scene: Phaser.Scene, mapConfig: MapConfigType[]) {
    this.scene = scene;

    // TODO: load map here

    // for each entry in the spawnerConfig, create a group
    this.spawners = spawnerConfig.reduce(
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
