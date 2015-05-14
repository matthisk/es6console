var Compilers = require('./compilers');
var Editors = require('./editors');
var Console = require('./console');

var $ = document.querySelector.bind(document);

var setup = function( wr ) {
  wr.style.height = `${window.innerHeight - 70}px`;
  wr.style.display = 'block';
};

(function() {
  var wrapper = $('.wrapper');
  setup( wrapper );

  var console = new Console();

  var inputTextArea = $("#input");
  var outputTextArea = $("#output");
  var compilerSelect = $("#compiler");
  var runBtn = $("#run");
  var transformBtn = $("#transform");

  var [inputEditor,outputEditor] = Editors.create( inputTextArea, outputTextArea );
  var transformer = ( input, output, transform ) => output( transform( input() ) );

  var runCode = function( code ) {
    let result;
    try {
      result = eval( code );
    } catch( e ) {
      return console.writeError( e );
    }
    console.writeLine( result );
  }

  var transform = function() {
    let input = inputEditor.getValue.bind(inputEditor);
    let output = outputEditor.setValue.bind(outputEditor);
    try {
      transformer( input, output, Compilers[ compilerSelect.value ].compile ); 
    } catch( e ) {
      let widget = Editors.makeErrorWidget( e );
      Editors.setErrorWidget( input, e.loc.line - 1, widget );
    }
  }

  transformBtn.onclick = transform; 

  runBtn.onclick = function() {
    runCode( outputEditor.getValue() );
  };

  console.on("run", function( input ) {
    runCode( outputEditor.getValue() + input );
    console.clear();
  }); 
  
})();
