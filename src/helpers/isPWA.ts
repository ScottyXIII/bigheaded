// https://stackoverflow.com/a/57920600

const isPWA = () =>
  ['fullscreen', 'standalone', 'minimal-ui'].some(
    displayMode => window.matchMedia(`(display-mode: ${displayMode})`).matches,
  );

export default isPWA;
