var Babel = {
    compile( input ) {
      let code = "",
          errors = [];
      try {
        code = babel.transform( input ).code;
      } catch( e ) {
        errors = [e];
      }
      
      return {
        code,
        errors
      };
    }
};

var Traceur = (function() {
  var compiler = new traceur.Compiler({
    modules: 'inline' 
  });

  var makeErrorFromMsg = function( msg ) {
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

  return {
    compile( input ) {
      let code = "", 
          errors = [];
      try {
        code = compiler.compile( input );
      } catch(errs) {
        errs.forEach(error => errors.push( makeErrorFromMsg( error ) ) );
      }
      
      return {
        code,
        errors
      };
    }
  };
})();

module.exports = {
  'Babel' : Babel,
  'Traceur' : Traceur
};

