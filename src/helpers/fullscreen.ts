import screenfull from 'screenfull';

const fullscreenAndLandscape = () => {
  if (screenfull.isEnabled) {
    screenfull.request(document.body, { navigationUI: 'hide' });
  }

  // next we change screen orientation to landscape!

  // https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_typedoc_node_modules_typescript_lib_lib_dom_d_.screenorientation.html#lock
  // this definitly works on chrome
  // because firefox doesnt support .lock ?
  // @ts-expect-error until https://github.com/microsoft/TypeScript-DOM-lib-generator/issues/1615 is closed
  window.screen.orientation.lock('landscape');
};

export default fullscreenAndLandscape;
