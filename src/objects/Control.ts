// keyboard, mouse and touch controller!

class Control {
  private scene: Phaser.Scene;

  private zones: Record<string, number>;

  private key: Record<string, Phaser.Input.Keyboard.Key> | undefined;

  public balance = 0;

  public jump = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    const { width } = scene.sys.game.canvas;
    this.zones = {
      halfWidth: width / 2, // half screen.
      quarterWidth: width / 4, // quarter screen.
    };

    // all devices have pointer (mouse or touchscreen)
    // some devices have keyboards
    // we register keys on mount
    const { keyboard } = scene.input;
    if (keyboard) {
      this.key = {
        left: keyboard.addKey('A'),
        right: keyboard.addKey('D'),
        jump: keyboard.addKey('SPACE'),
      };
    }
  }

  // this needs to be called in the scene update (every frame)
  update() {
    const { isDown, x } = this.scene.input.activePointer;
    const { quarterWidth, halfWidth } = this.zones;

    // touch booleans
    const isPointerLeft = x < quarterWidth && isDown;
    const isPointerRight = x >= quarterWidth && x < halfWidth && isDown;
    const isPointerJump = x >= halfWidth && isDown;

    // keyboard booleans
    const isKeyLeft = this.key?.left.isDown || false;
    const isKeyRight = this.key?.right.isDown || false;
    const isKeyJump = this.key?.jump.isDown || false;

    // combined booleans
    const isLeft = isPointerLeft || isKeyLeft;
    const isRight = isPointerRight || isKeyRight;
    const isJump = isPointerJump || isKeyJump;

    // final logic
    if (isLeft) this.balance = -1;
    else if (isRight) this.balance = 1;
    else this.balance = 0;
    if (isJump) this.jump = true;
    else this.jump = false;
  }
}

export default Control;
