import Base from './base'

import $script from 'scriptjs'

export default class Babel extends Base {
    loadCompiler() {
      $script(['https://unpkg.com/babel-standalone@6.15.0/babel.min.js'],() => {
        this.compiler = window.Babel;
        this.resolveFuture();
      });
    }

    compile( input, options ) {
      this._checkIfCompilerIsLoaded();

      let code = "",
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
