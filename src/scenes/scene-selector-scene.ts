import UIElement, { UIElementNames } from '@/objects/UIElement';
import googleFont, { FontFamilyEnum } from '@/helpers/googleFont';
import noNew from '@/helpers/noNew';

const sceneNames = [
  'preloader-scene',
  'main-menu-scene',
  'scene-selector-scene',
  'game-scene',
  'death-scene',
];

class SceneSelectorScene extends Phaser.Scene {
  public static preload(scene: Phaser.Scene) {
    UIElement.preload(scene);
  }

  constructor() {
    super('scene-selector-scene');
  }

  preload() {
    SceneSelectorScene.preload(this);
  }

  create() {
    const { width, height } = this.sys.game.canvas;
    const cx = width / 2;
    const cy = height / 2;

    googleFont(this, cx, cy - 300, {
      fontFamily: FontFamilyEnum.BAGEL,
      text: 'Scene Select',
      color: '#FFF',
      fontSize: 64,
      origin: 0.5,
    });

    for (let i = 0; i < sceneNames.length; i += 1) {
      const sceneName = sceneNames[i];
      noNew(UIElement, this, cx, 200 + i * 80, {
        uiElementName: UIElementNames.ButtonOrange,
        content: sceneName,
        width: 400,
        onClick: () => this.scene.start(sceneName),
      });
    }
  }
}

export default SceneSelectorScene;
