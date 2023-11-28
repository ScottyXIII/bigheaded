const touchEvents = (scene: Phaser.Scene) => {
  const pointer = scene.input.activePointer;
  const { width } = scene.sys.game.canvas;
  const cx = width / 2;

  if (pointer.isDown) {
    if (pointer.x < cx) {
      scene.events.emit('touch-left');
    } else {
      scene.events.emit('touch-right');
    }
  }
};

export default touchEvents;
