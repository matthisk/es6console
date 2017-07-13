import Base from './base';

import $script from 'scriptjs';

export default class Traceur extends Base {
  constructor() {
    super();
  }

  loadCompiler() {
    $script(['/dist/compilers/traceur.js'],() => {
      this.compiler = new traceur.Compiler({
        modules: 'inline'
      });
      this.resolveFuture();
    });
  }

  static makeErrorFromMsg( msg ) {
    let sm = msg.split(':'),
      line = parseInt( sm[1], 10 ),
      column = parseInt( sm[2], 10 ) - 1;

    return {
      loc : {
        line,
        column,
        offset : () => { return { line:line,column:NaN }; }
      },
      message : msg
    };
  }
  
  compile( input ) { 
    this._checkIfCompilerIsLoaded();
    
    let code = '', 
      errors = [];

    try {
      code = this.compiler.compile( input );
    } catch(errs) {
      errs.forEach(error => errors.push( Traceur.makeErrorFromMsg( error ) ) );
    }
    
    return {
      code,
      errors
    };
  }
}
