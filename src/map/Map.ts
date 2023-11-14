import Phaser from 'phaser';

const ROOT_MAP_FOLDER = 'map';

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

class Map {
  private scene: Phaser.Scene;

  private map: Phaser.Tilemaps.Tilemap | undefined; // TODO: dont call it map, as to not confuse with .map() array proto

  private tileWidth = 32;

  private tileHeight = 32;

  public layers = {};

  public layers2: Layer[] = [];

  public spawners: Phaser.Types.Tilemaps.TiledObject[] = [];

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

  constructor(scene: Phaser.Scene) {
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
    this.loadLayers();
    this.loadObjectLayers();
    this.height = this.layers.background.height;
    this.width = this.layers.background.width;
    this.x = this.layers.background.x;
    this.y = this.layers.background.y;

    this.scene.matter.world.setBounds(this.x, this.y, this.width, this.height);
  }

  loadLayers() {
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
  }

  loadObjectLayers() {
    const player = this.map?.findObject(
      'Spawner',
      obj => obj.name === 'player',
    );

    if (player) this.spawners.push(player);
  }
}

export default Map;
