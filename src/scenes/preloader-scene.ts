import Text from '@/objects/Text';
import MainMenuScene from '@/scenes/main-menu-scene';
import GameScene from '@/scenes/game-scene';
import DeathScene from '@/scenes/death-scene';

// the files come as the following types:
// - ImageFile2
// - SpriteSheetFile2
// - AudioFile2
// - TilemapJSONFile2
// - etc
// but I couldn't find much info online
type FileProgressType = { src: string; percentComplete: number };

class PreloaderScene extends Phaser.Scene {
  constructor() {
    super('preloader-scene');
  }

  preload() {
    const { width, height } = this.sys.game.canvas;
    const cx = width / 2;
    const cy = height / 2;
    const message1 = new Text(this, cx, cy - 20);
    const message2 = new Text(this, cx, cy + 20);

    message1.textbox.setOrigin(0.5, 0.5);
    message2.textbox.setOrigin(0.5, 0.5);

    message1.textbox.text = '0%';
    message2.textbox.text = 'LOADING...';

    this.load.on('progress', (value: number) => {
      const percent = Math.floor(value * 100);
      message1.textbox.text = `${percent}%`;
    });

    this.load.on('fileprogress', (file: FileProgressType) => {
      const { src, percentComplete } = file;
      const parts = src.split('/');
      const filename = parts[parts.length - 1];
      const percent = Math.floor(percentComplete * 100);
      message2.textbox.text = `${filename} (${percent}%)`;
    });

    this.load.on('complete', () => {
      message1.textbox.text = '';
      message2.textbox.text = '';
    });

    MainMenuScene.preload(this);
    GameScene.preload(this);
    DeathScene.preload(this);
  }

  create() {
    this.scene.start('main-menu-scene');
  }
}

export default PreloaderScene;
