import Base from './base';

export default class Regenerator extends Base {
  static makeError( { lineNumber, description, column, endColumn = NaN } ) {
    let l = lineNumber - 1;

    return {
      loc : {
        line : l,
        column : column,
        offset : () => { return { line: l,column:endColumn}; }
      },
      message : description
    };
  }

  loadCompiler() {
    require.ensure(['regenerator'],require => {
      this.compiler = require('regenerator');
      this.resolveFuture();
    });
  }

  compile( input ) {
    this._checkIfCompilerIsLoaded();

    let code = '',
      errors = [];

    try {
      code = this.compiler.compile( input ).code;
    } catch (e) {
      errors = [Regenerator.makeError( e )];
    }

    return {
      code,
      errors
    };
  }
}
