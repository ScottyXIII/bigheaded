import Phaser from "phaser";

class Map {

  private root : string = 'map';
  private tilesSheet: Phaser.GameObjects.Image | undefined;
  private tileMap: string | undefined;
  private mapKey: string = "";
  private tileSetName: string = "";
  private parallax: Object = {};
  private scene: Phaser.Scene;
  private Phaser;
  private layers: any = {};
  private fileNames: Record<string, string>;
  private map: Phaser.Tilemaps.Tilemap | undefined;
  private tileset: Phaser.Tilemaps.Tileset | null | undefined;

  public spawners: any = {};
  public height: integer = 0;
  public width: integer = 0;
  public x: integer = 0;
  public y: integer = 0;

  constructor(scene: Phaser.Scene, mapFolderName = '', tileSheetName = '', mapDataName = '', backgroundCount = 1) {
    this.Phaser = Phaser;
    this.scene = scene;

    this.fileNames = {
      map: mapFolderName ?? 'level1',
      tileSheet: tileSheetName ?? 'tileset.png',
      mapData: mapDataName ?? 'mapData.json',
      background: 'backgrounds',
      //musicFile: Sound.MapMusicFileName
    };
    this.mapKey = `${mapFolderName}-${mapDataName}`;
    this.tileSetName = 'tiles' // TileSet name set in the Tiled program.
    this.parallax = {
      backgroundCount: backgroundCount,
    }
  }
  
  preload() {
    //this.scene.load.spritesheet('healthPack', 'sprites/healthpack.png', { frameWidth: 48, frameHeight: 48 });
    //this.scene.load.spritesheet(Config.EXPLODING_BARRELS_TEXTURE, 'sprites/explosive-barrel.png', { frameWidth: 32, frameHeight: 32 });
  
    this.loadTileSheet();
    this.loadMapData();
  }
  
  getMapPath() {
    return this.root + '/' + this.fileNames.map;
  }

  getMusicPath() {
    return `${this.root}/${this.fileNames.musicFile}`;
  }

  getBackgroundPath() {
    return `${this.root}/${this.fileNames.map}/${this.fileNames.background}`;
  }

  getTileSheetPath() {
    return this.getMapPath() + '/tileset.png';
  }

  getMapDataPath() {
    return this.getMapPath() + '/mapData.json';
  }

  loadTileSheet(key = 'tileSheet') {
    this.scene.load.image(key, this.getTileSheetPath());
  }

  loadMapData() {
    this.scene.load.tilemapTiledJSON(this.mapKey, this.getMapDataPath());
  }

  loadLayers() {
    this.layers.background = this.map?.createLayer('Background', 'tiles'); 
    this.layers.solidground = this.map?.createLayer('Solidground', 'tiles');
   // this.layers.backgroundColourFront = this.map.createLayer('BackgroundColourFront', this.tileset)
    //this.layers.background = this.map.createLayer('Background', this.tileset)
    this.layers.foreground = this.map?.createLayer('Forground', 'tiles');
    //this.layers.ladders = this.map.createLayer('Ladders', this.tileset)
    //this.layers.toxicDamage = this.map.createLayer('ToxicDamage', this.tileset)

    this.layers.solidground?.setCollisionByProperty({ collides: true });
    
    this.layers.background?.setDepth(0);
    this.layers.solidground?.setDepth(10);
    this.layers.foreground?.setDepth(20);
    
    this.scene.matter.world.convertTilemapLayer(this.layers.background);
    this.scene.matter.world.convertTilemapLayer(this.layers.foreground);
    this.scene.matter.world.convertTilemapLayer(this.layers.solidground);

    this.spawners = {
      player: this.map?.findObject('Spawner', obj => obj.name === 'player'),
      zombie: this.getObjectFromLayer('Spawner', 'zombie'),
      exit: this.getObjectFromLayer('Spawner', 'exit'),
    };

  }

  getObjectFromLayer(layerName: string, objectNames: string) {
    let obj = this.map?.filterObjects(layerName, (obj) => obj.name === objectNames);
    obj?.forEach((element, index, array) => {
      element.properties?.map((data: any) => {
        element.properties[data.name ?? ''] = data.value ?? '';
      });
    });
    return obj;
  }

  setCollisionCategoryOnLayer(layer: any, collisionCategory: any) {
    layer.forEachTile(tile => {
      if (tile.physics.matterBody === undefined) return;
      tile.physics.matterBody.setCollisionCategory(collisionCategory);
    });
  }

  create() {
    this.map = this.scene.make.tilemap({ key:  this.mapKey });
    this.tileset = this.map?.addTilesetImage(this.tileSetName, 'tileSheet', 32, 32, 0, 0);
    this.loadLayers();
    this.x = this.layers.background.x;
    this.y = this.layers.background.y
    this.height = this.layers.background.height;
    this.width = this.layers.background.width;
  }
}

export default Map;