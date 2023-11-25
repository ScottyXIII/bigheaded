// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/By_example/Detect_WebGL

const detectWebGLContext = () => {
  const canvas = document.createElement('canvas');
  const gl =
    canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  return gl instanceof WebGLRenderingContext;
};

export default detectWebGLContext;
