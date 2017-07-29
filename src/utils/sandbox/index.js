import Compilers from 'compilers';

import { LogBuffer } from './log-buffer';
import { newWorker } from './worker';

// Disable modules so we do not insert use-strict
// on the first line.
const ES2015 = [
  'es2015',
  {
    modules: false,
  },
];

import runtimeScript from 'raw-loader!babel-polyfill/dist/polyfill.js';
import wrapScript from 'raw-loader!./wrap-code.js';

function createUserCodeBlobURL(code) {
  var blob;

  try {
    blob = new Blob([code], { type: 'application/javascript' });
  } catch (e) {
    window.BlobBuilder =
      window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
    blob = new window.BlobBuilder();
    blob.append(code);
    blob = blob.getBlob();
  }

  window.URL = window.URL || window.webkitURL;

  return window.URL.createObjectURL(blob);
}

export default class SandBox {
  constructor() {
    this.logBuffer = new LogBuffer();
  }

  updateUserCode() {
    console.warn('[SandBox.updateUserCode] deprecated');
  }

  runCode(code) {
    let out = {
      logBuffer: [],
      out: null,
    };
    let compiler = Compilers['Babel (6)'];

    // 1 : Compile the input code

    try {
      code = compiler.compile(code, {
        presets: [ES2015],
      }).code;
    } catch (e) {
      out.error = true;
      if (e instanceof this.frame.contentWindow.Error) {
        out.completionValue = window[e.name](e.message);
        // e is an instance of an Error object from the
        // frames window object
      } else {
        out.completionValue = new Error(e);
      }
      out.recoverable =
        (e instanceof SyntaxError ||
          e instanceof this.frame.contentWindow.SyntaxError) &&
        e.message.match('Unexpected (token|end)');
    }

    // 2 : Wrap input code with wrapScript and prepend the babel runtime

    let scriptAndRuntime = runtimeScript + wrapScript.replace('//CODE', code);

    // 3 : Create a blob url with which to run a WebWorker

    let blobURL = createUserCodeBlobURL(scriptAndRuntime);

    // 4 : Run a WebWorker

    return newWorker(blobURL, this.logBuffer).then(completionValue => {
      out.completionValue = completionValue;

      return out; 
    });
  }
}

export const sandbox = new SandBox();
