enum Directions {
  UP = 'Up',
  DOWN = 'Down',
  LEFT = 'Left',
  RIGHT = 'Right',
}
let hasSwiped = false;
let swipeDirection: Directions | undefined;

const handleSwipe = (scene: Phaser.Scene, swipeThreshold = 30) => {
  const pointer = scene.input.activePointer;

  if (!pointer.isDown) {
    if (hasSwiped) {
      scene.events.emit('swipeRelease');
      hasSwiped = false;
    }
  }

  if (!pointer.isDown) {
    hasSwiped = false; // Reset the flag when the pointer is not down
    return;
  }

  // Calculate the swipe distance
  const deltaX = pointer.upX - pointer.downX;
  const deltaY = pointer.upY - pointer.downY;

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

    hasSwiped = true;
    scene.events.emit('swipe', swipeDirection);
  }
};

export default handleSwipe;
