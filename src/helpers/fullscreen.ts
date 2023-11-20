import screenfull from 'screenfull';

const attachFullscreen = () => {
  const btn = document.getElementById('fullscreen');
  const el = document.getElementById('game');
  if (btn && el) {
    btn.addEventListener('click', () => {
      if (screenfull.isEnabled) {
        screenfull.request(el, { navigationUI: 'hide' });
      }

      // because firefox doesnt support .lock ?
      // https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_typedoc_node_modules_typescript_lib_lib_dom_d_.screenorientation.html#lock
      // @ts-expect-error until https://github.com/microsoft/TypeScript-DOM-lib-generator/issues/1615 is closed
      window.screen.orientation.lock('landscape');
    });
  }
};

export default attachFullscreen;
