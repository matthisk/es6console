import Base from './base';

import $script from 'scriptjs';

export default class Babel5 extends Base {
  loadCompiler() {
    $script(['/dist/compilers/browser.js'],() => {
      this.compiler = window.babel;
      this.resolveFuture();
    });
  }

  compile( input, options = {} ) {
    this._checkIfCompilerIsLoaded();

    let code = '',
      errors = [];
    try {
      code = this.compiler.transform( input, {
        babelrc: false,
        filename: 'repl',
      }).code;
    } catch( e ) {
      errors = [e];
    }
      
    return {
      code,
      errors
    };
  }
}
