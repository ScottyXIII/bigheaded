const handleSwipe = (scene: Phaser.Scene, swipeThreshold = 30) => {
  const pointer = scene.input.activePointer;
  let swipeDirection = '';

  // Calculate the swipe distance
  const deltaX = pointer.upX - pointer.downX;
  const deltaY = pointer.upY - pointer.downY;

  if (!pointer.isDown) return;

  // Does the swipe distance exceed the threshold?
  if (Math.abs(deltaX) > swipeThreshold || Math.abs(deltaY) > swipeThreshold) {
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        swipeDirection = 'right';
      } else {
        swipeDirection = 'left';
      }
    } else if (deltaY > 0) {
      swipeDirection = 'down';
    } else {
      swipeDirection = 'up';
    }

    scene.events.emit('swipe', swipeDirection);
  }
};

export default handleSwipe;
