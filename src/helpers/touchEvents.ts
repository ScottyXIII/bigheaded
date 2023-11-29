const touchEvents = (scene: Phaser.Scene) => {
  const pointer = scene.input.activePointer;
  const { width } = scene.sys.game.canvas;
  const halfWidth = width / 2; // half screen.
  const quarterWidth = width / 4; // quarter screen.

  if (pointer.isDown) {
    // right half of screen touch
    if (pointer.x > halfWidth) {
      scene.events.emit('touch-right');
      return;
    }

    // left half of screen touch
    if (pointer.x < quarterWidth) {
      scene.events.emit('touch-left-half');
    } else {
      scene.events.emit('touch-right-half');
    }
  }
};

export default touchEvents;
