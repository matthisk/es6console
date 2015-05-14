var Compilers = require('./compilers');
var Editors = require('./editors');
var Console = require('./console');

var $ = document.querySelector.bind(document);

var setup = function( wr ) {
  wr.style.height = `${window.innerHeight - 70}px`;
  wr.style.display = 'block';

  window.onresize = () => setup(wr);
};

(function() {
  var wrapper = $('.wrapper');
  setup( wrapper );

  var cnsl = new Console();

  window.console.log = function( msg ) {
    cnsl.writeLine( msg );
  }

  var inputTextArea = $("#input"),
      outputTextArea = $("#output"),
      compilerSelect = $("#compiler"),
      runBtn = $("#run"),
      transformBtn = $("#transform");

  var [inputEditor,outputEditor] = Editors.create( inputTextArea, outputTextArea );
  inputEditor.focus();

  var runCode = function( code ) {
    let result;
    try {
      result = eval( code );
    } catch( e ) {
      return cnsl.writeError( e );
    }
    cnsl.writeLine( result );
  }

  var transform = function() {
    Editors.clearErrors( inputEditor );

    let { errors, code } = Compilers[ compilerSelect.value ].compile( inputEditor.getValue() );

    outputEditor.setValue( code );
    Editors.setErrorMarkers( inputEditor, errors );
  }

  inputEditor.on("change",transform);

  transformBtn.onclick = transform; 

  runBtn.onclick = function() {
    runCode( outputEditor.getValue() );
  };

  cnsl.on("run", function( input ) {
    runCode( outputEditor.getValue() + input );
    cnsl.clear();
  }); 
  
})();
