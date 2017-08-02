import Base from './base';

import removeConsolePlugin from 'babel-plugin-transform-remove-console';

import $script from 'scriptjs';

export default class Babel extends Base {
  loadCompiler() {
    $script(['https://unpkg.com/babel-standalone@6.25.0/babel.min.js'],() => {
      this.compiler = window.Babel;
      this.compiler.registerPlugin('transform-remove-console', removeConsolePlugin);
      this.resolveFuture();
    });
  }

  transform(input, options) {
    return this.compiler.transform(input, options);
  }

  compile( input, options ) {
    this._checkIfCompilerIsLoaded();

    let code = '',
      errors = [];
    try {
      code = this.compiler.transform( input, { 
        babelrc: false,
        filename: 'repl',
        ...options 
      } ).code;
    } catch( e ) {
      errors = [e];
    }
      
    return {
      code,
      errors
    };
  }
}
