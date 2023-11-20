import Phaser from 'phaser';
import Ben1 from './Ben1';
import SpinText from './SpinText';
import Ball from './Ball';

type LayerConfigType = {
  tiledLayerName: string;
  depth: number;
};

type SpawnerConfigType = {
  tiledObjectName: string;
  classFactory: Ben1 | SpinText | Ball; // any class
  maxSize: number;
  runChildUpdate: boolean;
  autoSpawn: boolean;
};

type LevelConfigType = {
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

class Level {
  private level: Phaser.Tilemaps.Tilemap | undefined;

  private layers: LayersObjType = {};

  public spawners: SpawnersObjType = {};

  static preload(scene: Phaser.Scene, levelConfig: LevelConfigType) {
    const { tilesetPng, tiledMapJson, spawnerConfig } = levelConfig;
    scene.load.image('tileSheet', tilesetPng);
    scene.load.tilemapTiledJSON('level1', tiledMapJson);
    for (let i = 0; i < spawnerConfig.length; i += 1) {
      const { classFactory } = spawnerConfig[i];
      classFactory.preload?.(scene);
    }
  }

  constructor(scene: Phaser.Scene, levelConfig: LevelConfigType) {
    const {
      tileWidth,
      tileHeight,
      tileMargin,
      tileSpacing,
      layerConfig,
      spawnerConfig,
    } = levelConfig;

    // load tiles
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
    this.layers = layerConfig.reduce((acc, { tiledLayerName, depth }) => {
      const layer = this.level?.createLayer(tiledLayerName, 'tiles');

      if (!layer) return acc;

      layer.setDepth(depth);

      return { ...acc, [tiledLayerName]: layer };
    }, {});

    // load staticbodies
    const staticbody = this.level.getObjectLayer('staticbody')?.objects || [];
    for (let i = 0; i < staticbody.length; i += 1) {
      const { x, y, polygon } = staticbody[i];
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
    const spawnersT = this.level.getObjectLayer('spawner')?.objects || [];
    this.spawners = spawnerConfig.reduce(
      (
        acc,
        { tiledObjectName, classFactory, maxSize, runChildUpdate, autoSpawn },
      ) => {
        const group = scene.add.group({
          maxSize,
          classType: classFactory,
          runChildUpdate,
        });

        if (autoSpawn) {
          const locations = spawnersT.filter(
            ({ name }) => name === tiledObjectName,
          );

          for (let i = 0; i < locations.length; i += 1) {
            const { x, y } = locations[i];
            group.get(x, y);
          }
        }

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

export default Level;
