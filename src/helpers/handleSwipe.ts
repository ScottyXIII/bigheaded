enum Directions {
  UP = 'Up',
  DOWN = 'Down',
  LEFT = 'Left',
  RIGHT = 'Right',
}

const handleSwipe = (scene: Phaser.Scene, swipeThreshold = 30) => {
  const pointer = scene.input.activePointer;
  let swipeDirection: Directions | undefined;

  // Calculate the swipe distance
  const deltaX = pointer.upX - pointer.downX;
  const deltaY = pointer.upY - pointer.downY;

  if (!pointer.isDown) return;

  // Does the swipe distance exceed the threshold?
  if (Math.abs(deltaX) > swipeThreshold || Math.abs(deltaY) > swipeThreshold) {
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        swipeDirection = Directions.RIGHT;
      } else {
        swipeDirection = Directions.LEFT;
      }
    } else if (deltaY > 0) {
      swipeDirection = Directions.DOWN;
    } else {
      swipeDirection = Directions.UP;
    }

    scene.events.emit('swipe', swipeDirection);
  }
};

export default handleSwipe;
