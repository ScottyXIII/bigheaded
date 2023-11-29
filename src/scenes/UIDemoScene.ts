import UIElement, { UIElementNames } from '@/objects/UIElement';
import noNew from '@/helpers/noNew';

class UIDemoScene extends Phaser.Scene {
  public static preload(scene: Phaser.Scene) {
    UIElement.preload(scene);
  }

  constructor() {
    super('ui-demo-scene');
  }

  preload() {
    UIDemoScene.preload(this);
  }

  create() {
    const allElementNames = Object.values(UIElementNames);

    for (let i = 0; i < allElementNames.length; i += 1) {
      const paddingTop = 120;
      const paddingLeft = 5;
      const width = 300;
      const gapX = 20;
      const gapY = 110;
      const elCenterX = width / 2;
      const columns = 4;
      const x = i % columns;
      const y = Math.floor(i / columns);
      const posX = paddingLeft + elCenterX + x * (width + gapX);
      const posY = paddingTop + y * gapY;

      const uiElementName = allElementNames[i];
      noNew(UIElement, this, posX, posY, {
        uiElementName,
        content: uiElementName,
        width,
        // eslint-disable-next-line no-alert
        onClick: () => {
          // eslint-disable-next-line no-alert
          alert(`UIElementName: ${uiElementName}`);
          this.scene.start('scene-selector-scene');
        },
      });
    }
  }
}

export default UIDemoScene;
