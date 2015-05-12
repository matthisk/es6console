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
    lineNumbers : true,
    gutters : ['CodeMirror-linenumbers','errors']
  };

  var outputEditor = CodeMirror.fromTextArea(outputTextArea, config);
  var inputEditor = CodeMirror.fromTextArea(inputTextArea, config);

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

  var Compilers = {
    'Babel' : Babel,
    'Traceur' : Traceur
  };

  var transformer = function( input, output, transform ) {
    output( transform( input() ) );
  };

  function makeErrorWidget( error ) {
    var marker = document.createElement('div');
    var icon = marker.appendChild(document.createElement("span"));
    marker.appendChild(document.createTextNode( error.message ));
    icon.innerHTML = "!!";
    icon.className = "lint-error-icon";
    marker.className = "lint-error";
    return marker;
  }

  document.getElementById("transform").onclick = function() { 
    try {
      transformer( inputEditor.getValue.bind(inputEditor), outputEditor.setValue.bind(outputEditor), Compilers[ compilerSelect.value ].compile ); 
    } catch( e ) {
      inputEditor.addLineWidget( e.loc.line - 1, makeErrorWidget(e), { coverGutter : false, noHScroll : true } );
    }
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
