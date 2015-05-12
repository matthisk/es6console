var jsMode = require('codemirror/mode/javascript/javascript')
var CodeMirror = require('codemirror');

(function() {
  var inputTextArea = document.getElementById("input");
  var outputTextArea = document.getElementById("output");
  var compilerSelect = document.getElementById("compiler");
  var fiddleConsole = document.getElementById("console");
  var fiddleConsoleInput = document.getElementById("console-input");

  var config = {
    mode : "javascript",
    lineNumbers : true
  };

  var outputEditor = CodeMirror.fromTextArea(outputTextArea, config);
  var inputEditor = CodeMirror.fromTextArea(inputTextArea, config);

  var Babel = (function() {
    return {
      compile : function( input ) {
        return babel.transform( input ).code;
      }
    };
  })();

  var Traceur = (function() {
    this.compiler = new traceur.Compiler();

    return {
      compile : function( input ) {
        return this.compiler.compile( input );
      }
    };
  })();

  var Compilers = {
    'Babel' : Babel,
    'Traceur' : Traceur
  };

  var transformer = function( input, output, transform ) {
    output( transform( input() ) );
  };

  document.getElementById("transform").onclick = function() { 
    transformer( inputEditor.getValue.bind(inputEditor), outputEditor.setValue.bind(outputEditor), Compilers[ compilerSelect.value ].compile ); 
  };

  document.getElementById("run").onclick = function() {
    var code = outputEditor.getValue();
    var result = eval( code );

    fiddleConsole.value += result.toString() + "\n";
  };

  fiddleConsoleInput.onkeyup = function( event ) {
    if( event.keyCode === 13 ) {
      var code = outputEditor.getValue();
      var result = eval( code + fiddleConsoleInput.value );
      fiddleConsole.value += result.toString() + "\n";
      fiddleConsoleInput.value = "";
    }
  } 
  
})();
