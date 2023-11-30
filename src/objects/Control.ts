// keyboard, mouse and touch controller!

class Control {
  private scene: Phaser.Scene;

  private zones: Record<string, number>;

  public balance = 0;

  public jump = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    scene.input.addPointer(2); // allow multi-touch

    const { width } = scene.sys.game.canvas;
    this.zones = {
      halfWidth: width / 2, // half screen.
      quarterWidth: width / 4, // quarter screen.
      deadZone: width - 100,
    };

    // some devices have keyboards
    const { keyboard } = scene.input;
    if (keyboard) {
      keyboard.on('keydown-A', this.setLeft);
      keyboard.on('keydown-D', this.setRight);
      keyboard.on('keydown-SPACE', this.setJumpOn);

      keyboard.on('keyup-A', this.setCenter);
      keyboard.on('keyup-D', this.setCenter);
      keyboard.on('keyup-SPACE', this.setJumpOff);

      scene.events.on('shutdown', () => {
        keyboard.off('keydown-A');
        keyboard.off('keydown-D');
        keyboard.off('keydown-SPACE');

        keyboard.off('keyup-A');
        keyboard.off('keyup-D');
        keyboard.off('keyup-SPACE');
      });
    }
  }

  private setJumpOn() {
    this.jump = true;
  }

  private setJumpOff() {
    this.jump = false;
  }

  private setLeft() {
    this.balance = -1;
  }

  private setCenter() {
    this.balance = 0;
  }

  private setRight() {
    this.balance = +1;
  }

  // all devices have pointer (mouse or touchscreen)
  // this needs to be called in the scene update (every frame)
  public update() {
    const { isDown, x } = this.scene.input.activePointer;

    console.log('update Control', this.balance, this.jump);

    // right half of screen touch
    if (x > this.zones.halfWidth && x < this.zones.deadZone) {
      if (isDown) {
        this.setJumpOn();
      } else {
        this.setJumpOff();
      }
      return;
    }

    // left half of screen touch
    if (x < this.zones.quarterWidth) {
      if (isDown) {
        this.setLeft();
      } else {
        this.setCenter();
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (isDown) {
        this.setRight();
      } else {
        this.setCenter();
      }
    }
  }
}

export default Control;
