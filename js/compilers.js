var Babel = {
    compile( input ) {
      return babel.transform( input ).code;
    }
};

var Traceur = (function() {
  var compiler = new traceur.Compiler();

  return {
    compile( input ) {
      return compiler.compile( input );
    }
  };
})();

module.exports = {
  'Babel' : Babel,
  'Traceur' : Traceur
};

