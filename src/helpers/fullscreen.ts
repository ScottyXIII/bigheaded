import screenfull from 'screenfull';

const attachFullscreen = () => {
  const btn = document.getElementById('fullscreen');
  const el = document.getElementById('game');
  if (btn && el) {
    btn.addEventListener('click', () => {
      if (screenfull.isEnabled) {
        screenfull.request(el, { navigationUI: 'hide' });
      }

      // @ts-ignore
      window.screen.orientation.lock('landscape');
    });
  }
};

export default attachFullscreen;
