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

const mapConfig = {
  layers: {
    Background: {
      depth: 0,
    },
    Solidground: {
      collisions: true,
      depth: 10,
      collisionsCategory: 101,
    },
    Foreground: {
      depth: 20,
    },
  },
};

class Map {
  private scene: Phaser.Scene;

  private map: Phaser.Tilemaps.Tilemap | undefined;

  private mapDataFile: string;

  private tileSheetFile: string;

  private tileWidth = 32;

  private tileHeight = 32;

  public layers = {};

  public spawners = {};

  public height = 0;

  public width = 0;

  public x = 0;

  public y = 0;

  constructor(
    scene: Phaser.Scene,
    tileSheet: string = 'tileset.png',
    mapData: string = 'mapData.json',
  ) {
    this.scene = scene;
    this.mapDataFile = mapData;
    this.tileSheetFile = tileSheet;
  }

  setTileDimensions(width: number, height: number) {
    this.tileWidth = width;
    this.tileHeight = height;
  }

  preload() {
    this.scene.load.image(TILE_SHEET_KEY, getFilePath(this.tileSheetFile));
    this.scene.load.tilemapTiledJSON(
      ROOT_MAP_FOLDER,
      getFilePath(this.mapDataFile),
    );
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
    this.spawners = {
      player: this.map?.findObject('Spawner', obj => obj.name === 'player'),
    };
  }

  getObjectFromLayer(
    layerName: string,
    objectNames: string,
  ): Phaser.Types.Tilemaps.TiledObject[] | undefined | null {
    const obj = this.map?.filterObjects(
      layerName,
      object => object.name === objectNames,
    );
    obj?.forEach(element => {
      element.properties?.map((data: any) => {
        element.properties[data.name ?? ''] = data.value ?? '';
      });
    });
    return obj;
  }

  create() {
    this.map = this.scene.make.tilemap({ key: ROOT_MAP_FOLDER });
    this.map?.addTilesetImage(
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
  }
}

export default Map;
