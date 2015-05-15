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
  
  // DOM Elements
  var inputTextArea = $("#input"),
      outputTextArea = $("#output"),
      compilerSelect = $("#compiler"),
      runBtn = $("#run"),
      transformBtn = $("#transform"),
      body = document.getElementsByTagName("body")[0],
      sandboxFrame = document.createElement("iframe");

  body.appendChild( sandboxFrame );

  // Overwrite the console log function of the sandbox to write results
  // to our own console.
  sandboxFrame.contentWindow.console.log = function( ...args ) {
    let res = '';
    if( typeof args[0] === 'string' && args[0].search("%s") !== -1) {
      let s = args[0],
          search,
          i = 1;

      while( i < args.length && (search = s.search(/%s|%d|%i|%f]/)) !== -1 ) {
        let replace = s[search] + s[search+1];
        s = s.replace(replace,args[i]);
        i++;
      }

      cnsl.writeLine( s );
    } else {
      args.forEach(arg => {
        if( typeof arg === 'object' ) res += `${JSON.stringify(arg)} `;
        else res += `${arg} `;
      });
    }

    cnsl.writeLine( res ); 
  };

  var [inputEditor,outputEditor] = Editors.create( inputTextArea, outputTextArea );
  inputEditor.focus();

  var runCode = function( code ) {
    let result;
    try {
      result = sandboxFrame.contentWindow.eval( code );
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
