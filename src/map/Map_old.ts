import Phaser from 'phaser';

const ROOT_MAP_FOLDER = 'level/map';

const TILE_MARGIN = 0;
const TILE_SPACING = 0;

const TILE_SHEET_KEY = 'tileSheet';
const TILE_SHEET_NAME = 'tiles'; // name of the tiles in the Tiled programme

const getFilePath = (filePath: string) => `${ROOT_MAP_FOLDER}/${filePath}`;

const setCollisionCategoryOnLayer = (
  layer: Phaser.Tilemaps.TilemapLayer | null,
  collisionCategory: number,
) => {
  layer?.forEachTile(tile => {
    tile.physics.matterBody?.setCollisionCategory?.(collisionCategory);
  });
};

type Layer = {
  key: string;
  tileLayer: Phaser.Tilemaps.TilemapLayer;
  collisions: boolean;
  collisionsCategory: number;
  depth: number;
};

const mapConfig = {
  layers: {
    Background: {
      depth: 0,
    } as Layer,
    Solidground: {
      collisions: true,
      depth: 10,
      collisionsCategory: 101,
    } as Layer,
    Foreground: {
      depth: 20,
    } as Layer,
  },
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

  private tileWidth = 32;

  private tileHeight = 32;

  public layers = {};

  public layers2: Layer[] = [];

  public spawners: SpawnersObjType = {};

  public height = 0;

  public width = 0;

  public x = 0;

  public y = 0;

  static preload(
    scene: Phaser.Scene,
    tileSheet = 'tileset.png',
    mapData = 'mapData.json',
  ) {
    scene.load.image(TILE_SHEET_KEY, getFilePath(tileSheet));
    scene.load.tilemapTiledJSON(ROOT_MAP_FOLDER, getFilePath(mapData));
  }

  constructor(scene: Phaser.Scene, spawnerConfig: SpawnerConfigType[]) {
    this.scene = scene;

    this.map = this.scene.make.tilemap({ key: ROOT_MAP_FOLDER });
    this.map.addTilesetImage(
      TILE_SHEET_NAME,
      TILE_SHEET_KEY,
      this.tileWidth,
      this.tileHeight,
      TILE_MARGIN,
      TILE_SPACING,
    );

    // loadLayers
    const layers = Object.keys(mapConfig.layers);
    layers.forEach((layer: string) => {
      const key = layer.toLowerCase();
      this.layers[key] = this.map?.createLayer(layer, 'tiles');

      if (mapConfig.layers[layer].collisions === true) {
        this.layers[key]?.setCollisionByProperty({ collides: true });
        this.scene.matter.world.convertTilemapLayer(this.layers[key]);
      }

      if (mapConfig.layers[layer].depth !== undefined) {
        this.layers[key]?.setDepth(mapConfig.layers[layer].depth);
      }

      if (mapConfig.layers[layer].collisionsCategory !== undefined) {
        setCollisionCategoryOnLayer(
          this.layers[key],
          mapConfig.layers[layer].collisionsCategory,
        );
      }
    });

    // loadObjectLayers
    // const player = this.map.findObject('Spawner', obj => obj.name === 'player');
    // console.log({ player });
    // if (player) this.spawners.push(player);

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