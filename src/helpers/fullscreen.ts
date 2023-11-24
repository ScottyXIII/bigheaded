import screenfull from 'screenfull';

const fullscreenAndLandscape = () => {
  const el = document.querySelector('canvas#game') as Element;
  if (screenfull.isEnabled) {
    screenfull.request(el, { navigationUI: 'hide' });
  }

  // next we change screen orientation to landscape!

  // this definitly works on chrome
  // because firefox doesnt support .lock ?
  // https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_typedoc_node_modules_typescript_lib_lib_dom_d_.screenorientation.html#lock
  // @ts-expect-error until https://github.com/microsoft/TypeScript-DOM-lib-generator/issues/1615 is closed
  window.screen.orientation.lock('landscape');

  const lockOrientation =
    // @ts-expect-error these are deprecated, but might still work
    window.screen.lockOrientation ||
    // @ts-expect-error these are deprecated, but might still work
    window.screen.mozLockOrientation ||
    // @ts-expect-error these are deprecated, but might still work
    window.screen.msLockOrientation;

  lockOrientation('landscape');
};

export default fullscreenAndLandscape;
