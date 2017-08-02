import workerRuntime from 'raw-loader!./worker-runtime.js';
import polyfillRuntime from 'raw-loader!babel-polyfill/dist/polyfill.js';

export {
  workerRuntime,
  polyfillRuntime,
};