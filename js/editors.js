var CodeMirror = require('codemirror');
var jsMode = require('codemirror/mode/javascript/javascript');

var config = {
  mode : "javascript",
  lineNumbers : true,
  gutters : ['CodeMirror-linenumbers','errors']
};

function create( inputArea, outputArea ) {
  var inputEditor = CodeMirror.fromTextArea(inputArea, config);
  var outputEditor = CodeMirror.fromTextArea(outputArea, config);
  
  return [inputEditor,outputEditor];
}

function makeErrorWidget( error ) {
  var marker = document.createElement('div');
  var icon = marker.appendChild(document.createElement("span"));
  marker.appendChild(document.createTextNode( error.message ));
  icon.innerHTML = "!!";
  icon.className = "lint-error-icon";
  marker.className = "lint-error";
  return marker;
}

function setErrorWidget( editor, lineNumber, widget ) {
  editor.addLineWidget( lineNumber, widget, { coverGutter : false, noHScroll : true } );
}

module.exports = {
  create,
  makeErrorWidget,
  setErrorWidget
};
