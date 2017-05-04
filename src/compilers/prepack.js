import Base from './base';

export default class Prepack extends Base {
  static makeError( { lineNumber, description, column, endColumn = NaN } ) {
    let l = lineNumber - 1;

    return {
      loc : {
        line : l,
        column : column,
        offset : () => { return { line: l,column:endColumn} }
      },
      message : description
    };
  }

  loadCompiler() {
    require.ensure(['prepack'],require => {
      this.compiler = require('prepack');
      this.resolveFuture();
    });
  }

  compile( input ) {
    this._checkIfCompilerIsLoaded();

    let code = "",
        errors = [];

    try {
        code = this.compiler.prepack(input).code;
    } catch (e) {
        // errors = [e];
    }

    return {
      code,
      errors
    };
  }
}
