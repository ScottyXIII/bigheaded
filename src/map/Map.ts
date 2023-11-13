import Phaser from "phaser";

const ROOT_MAP_FOLDER = 'map';

const TILE_WIDTH = 32;
const TILE_HEIGHT = 32;

const TILE_MARGIN = 0;
const TILE_SPACING = 0;

const MAP_KEY = ROOT_MAP_FOLDER;
const TILE_SHEET_KEY = 'tileSheet';
const TILE_SHEET_NAME = 'tiles'; // name of the tiles in the Tiled programme

const MAP_DATA_FILE = 'mapData.json';
const TILE_SHEET_FILE_PATH = 'tileset.png';

const mapConfig : any = {
  layers : {
    'Background' : {
      depth: 0,
    }, 
    'Solidground' : {
      collisions: true,
      depth: 10,
      collisionsCategory: 101,
    },
    'Forground' : {
      depth: 20,
    }
  }
};

class Map {

  private scene: Phaser.Scene;

  private map: Phaser.Tilemaps.Tilemap | undefined;

  private tileset: Phaser.Tilemaps.Tileset | null | undefined;

  public layers: any = {};

  public spawners: any = {};

  public height: number = 0;

  public width: number = 0;

  public x: number = 0;

  public y: number = 0;
  
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }
  
  preload(): void {
    this.scene.load.image(TILE_SHEET_KEY, this.getFilePath(TILE_SHEET_FILE_PATH));
    this.scene.load.tilemapTiledJSON(MAP_KEY, this.getFilePath(MAP_DATA_FILE));
  }

  getFilePath(filePath: string): string {
    return `${ROOT_MAP_FOLDER}/${filePath}`;
  }
  
  loadLayers(): void {
    const layers = Object.keys(mapConfig.layers);
    layers.forEach((layer: string) => {
      const key = layer.toLowerCase();
      this.layers[key] = this.map?.createLayer(layer, 'tiles');
      
      if (mapConfig.layers[layer].collisions === true) {
        this.layers[key]?.setCollisionByProperty({collides: true});
        this.scene.matter.world.convertTilemapLayer(this.layers[key]);
      }

      if (mapConfig.layers[layer].depth !== undefined) {
        this.layers[key]?.setDepth(mapConfig.layers[layer].depth);
      }

      if (mapConfig.layers[layer].collisionsCategory !== undefined) {
        this.setCollisionCategoryOnLayer(this.layers[key], mapConfig.layers[layer].collisionsCategory);
      }
    });
  }

  loadObjectLayers(): void {
    this.spawners = {
      player: this.map?.findObject('Spawner', obj => obj.name === 'player'),
    };
  }

  getObjectFromLayer(layerName: string, objectNames: string): Phaser.Types.Tilemaps.TiledObject[] | undefined | null {
    const obj = this.map?.filterObjects(layerName, (object) => object.name === objectNames);
    obj?.forEach((element) => {
      element.properties?.map((data: any) => {
        element.properties[data.name ?? ''] = data.value ?? '';
      });
    });
    return obj;
  }

  setCollisionCategoryOnLayer(layer: any, collisionCategory: any): void {
    layer.forEachTile(tile => {
      if (tile.physics.matterBody === undefined) return;
      tile.physics.matterBody.setCollisionCategory(collisionCategory);
    });
  }
  
  create(): void {
    this.map = this.scene.make.tilemap({key:  MAP_KEY});
    this.tileset = this.map?.addTilesetImage(TILE_SHEET_NAME, TILE_SHEET_KEY, TILE_WIDTH, TILE_HEIGHT, TILE_MARGIN, TILE_SPACING);
    this.loadLayers();
    this.loadObjectLayers();
    this.height = this.layers.background.height;
    this.width = this.layers.background.width;
    this.x = this.layers.background.x;
    this.y = this.layers.background.y;
  }
}

export default Map;