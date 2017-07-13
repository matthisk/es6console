export default class Base {
  constructor() {
    this.compiler = undefined;
    this.future = new Promise(resolve => {
      this.resolveFuture = resolve;
    });
  }

  _checkIfCompilerIsLoaded() {
    if( ! this.compiler ) {
      throw new Error([
        'Compiler is not initialized call',
        '`loadCompiler` before invoking this function.',
      ].join(' '));
    }
  }

  initCompiler() {
    if (! this.isInitialized())  {
      this.loadCompiler();
    }

    return this.future;
  }

  isInitialized() {
    return this.compiler !== undefined;
  }
}
