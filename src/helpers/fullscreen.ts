const attachFullscreen = () => {
  const btn = document.getElementById('fullscreen');
  const el = document.getElementById('game');
  if (btn && el) {
    btn.addEventListener('click', () => {
      if (el.requestFullscreen) {
        el.requestFullscreen();
        // @ts-ignore
      } else if (el.msRequestFullscreen) {
        // @ts-ignore
        el.msRequestFullscreen();
        // @ts-ignore
      } else if (el.mozRequestFullScreen) {
        // @ts-ignore
        el.mozRequestFullScreen();
        // @ts-ignore
      } else if (el.webkitRequestFullScreen) {
        // @ts-ignore
        el.webkitRequestFullScreen();
      }
      // @ts-ignore
      window.screen.orientation.lock('landscape');
    });
  }
};

export default attachFullscreen;
