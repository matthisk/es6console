import { newWorker, createBlobURL } from './worker';

jest.mock('./runtime', () => ({
  workerRuntime: '',
  polyfillRuntime: '',
}));

let workerMock;

beforeEach(() => {
  global.Worker = jest.fn(() => {
    workerMock = {
      postMessage: jest.fn(),
    };

    return workerMock;
  });
  global.MessageChannel = jest.fn(() => ({
    port1: {
      onmessage: jest.fn(),
    },
    port2: {
      onmessage: jest.fn(),
    }
  }));
  global.Blob = jest.fn();
  window.URL = {};
  window.URL.createObjectURL =  jest.fn();
  window.BlobBuilder = jest.fn(() => ({
    append: jest.fn(),
    getBlob: jest.fn(),
  }));
});

afterEach(() => {
  delete global.Worker;
  delete global.MessageChannel;
  delete global.Blob;
  delete window.URL;
  delete window.BlobBuilder;
});

describe('newWorker', () => {
  it('#happy-flow', () => {
    const code = '';
    const opts = {};
    
    window.URL.createObjectURL = jest.fn(blob => 'url');

    const result = newWorker(code, opts);

    expect(result).toBeInstanceOf(Promise);

    expect(global.Worker).toHaveBeenCalledWith('url#url');
    expect(global.MessageChannel).toHaveBeenCalledTimes(2);
    expect(workerMock.postMessage).toHaveBeenCalledTimes(2);
  });
});

describe('createBlobURL', () => {
  it('#happy-flow', () => {
    createBlobURL('let x = 0;');

    expect(global.Blob).toHaveBeenCalledTimes(1);
    expect(global.window.URL.createObjectURL).toHaveBeenCalledTimes(1);
  });

  it('#non-happy-flow', () => {
    global.Blob = jest.fn(() => {
      throw new Error('test error');
    });
    
    createBlobURL('let x = 0;');

    expect(global.Blob).toHaveBeenCalledTimes(1);
    expect(window.BlobBuilder).toHaveBeenCalledTimes(1);
    expect(global.window.URL.createObjectURL).toHaveBeenCalledTimes(1);
  });
  
});