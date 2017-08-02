import { workerRuntime as runtime, polyfillRuntime } from './runtime';

import LogBuffer from './log-buffer';

const logBuffer = new LogBuffer();

export function createBlobURL(code) {
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

export function newWorker(code, opts) {
  // 1: Create Blob URL for the workercode and the usercode
  const workerCodeBlobURL = createBlobURL(polyfillRuntime + '\n' + runtime);
  const userCodeBlobURL = createBlobURL([
    opts.runtime,
    code,
  ].join('\n'));

  // 2: Create a worker

  const w = new Worker(`${workerCodeBlobURL}#${userCodeBlobURL}`);

  // 3: Create a side channel for the worker to send log messages on
  const channel = new MessageChannel();
  const completionChannel = new MessageChannel();

  // 4: Send one end of the channel to the worker
  w.postMessage('completion', [completionChannel.port2]);
  w.postMessage('console', [channel.port2]);

  // 5: And listen for log messages on the other end of the channel
  channel.port1.onmessage = (e) => {
    logBuffer.append(...e.data);
  };

  // 6: Create a promise to return
  return new Promise((resolve, reject) => {
    let timeoutID;
    const cleanup = () => {
      clearTimeout(timeoutID);
      channel.port1.onmessage = null;
      completionChannel.port1.onmessage = null;
      w.terminate();
    };
    
    const onerror = (event) => {
      cleanup();
      reject(event);
    };

    const onFinish = (e) => {
      cleanup();
      resolve({
        out: {
          completionValue: e ? e.data : null,
          error: false,
          recoverable: false,
        },
        logBuffer: logBuffer.flush(),
      });
    };
    
    timeoutID = setTimeout(onFinish, opts.workerTimeout);
    
    w.onerror = onerror;
    completionChannel.port1.onmessage = onFinish;
  });
}