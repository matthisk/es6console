import Base from './base'

export default class TypeScript extends Base {
  loadCompiler() {
    require.ensure(['typescript'],require => {
      this.compiler = require('typescript'); 
      this.resolveFuture();
    });
  }
  
  compile( input ) {
      this._checkIfCompilerIsLoaded();

      let code = '',
          errors = [];
      
      code = this.compiler.transpile( input, { module: this.compiler.ModuleKind.CommonJS });

      return {
        code,
        errors
      };
  }
}