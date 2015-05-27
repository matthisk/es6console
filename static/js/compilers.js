import $script from 'scriptjs';

class Base {
  constructor() {
    this.compiler = undefined;
  }

  initCompiler( callback ) {
    callback(); 
  }
}

class Babel extends Base {
    initCompiler( callback ) {
      $script(['/dist/compilers/browser.js'],() => {
        this.compiler = babel;
        callback();
      });
    }

    compile( input ) {
      if( ! this.compiler ) return {};

      let code = "",
          errors = [];
      try {
        code = this.compiler.transform( input ).code;
      } catch( e ) {
        errors = [e];
      }
      
      return {
        code,
        errors
      };
    }
}

class Traceur extends Base {
  constructor() {
    super();
  }

  initCompiler( callback ) {
    $script(['/dist/compilers/traceur.js'],() => {
      this.compiler = new traceur.Compiler({
        modules: 'inline'
      });
      callback();
    });
  }

  static makeErrorFromMsg( msg ) {
    let sm = msg.split(":"),
        line = parseInt( sm[1], 10 ),
        column = parseInt( sm[2], 10 ) - 1;

    return {
      loc : {
        line,
        column,
        offset : () => { return { line:line,column:NaN } }
      },
      message : msg
    };
  }
  
  compile( input ) { 
    if( ! this.compiler ) return {};
   let code = "", 
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

class Regenerator extends Base {
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

  initCompiler( callback ) {
    require.ensure(['regenerator'],require => {
      this.compiler = require('regenerator');
      callback();
    });    
  }

  compile( input ) {
    if( ! this.compiler ) return {};

    let code = "",
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

class TypeScript extends Base {
  initCompiler( callback ) {
    require.ensure(['typescript'],require => {
      this.compiler = require('typescript'); 
      callback();
    });
  }
  
  compile( input ) {
      if( ! this.compiler ) return {};

      let code = '',
          errors = [];
      
      code = this.compiler.transpile( input, { module: this.compiler.ModuleKind.CommonJS });

      return {
        code,
        errors
      };
  }
}

export default {
  'Babel' : new Babel(),
  'Traceur' : new Traceur(),
  'TypeScript' : new TypeScript(),
  'Regenerator' : new Regenerator(),
};

