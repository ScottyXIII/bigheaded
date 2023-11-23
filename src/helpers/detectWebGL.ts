const detectWebGLContext = () => {
  const canvas = document.createElement('canvas');
  const gl =
    canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  return gl instanceof WebGLRenderingContext;
};

export default detectWebGLContext;
