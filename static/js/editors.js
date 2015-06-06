import CodeMirror from 'codemirror';
import jsMode from 'codemirror/mode/javascript/javascript';

var GUTTER_ID = "Compiler-markers";
var config = {
  mode : "javascript",
  theme : "eclipse",
  lineNumbers : true,
  gutters : [GUTTER_ID,'CodeMirror-linenumbers'],
  viewportMargin : Infinity,
};

function create( inputArea, outputArea ) {
  var inputEditor = CodeMirror.fromTextArea(inputArea, config);
  var outputEditor = CodeMirror.fromTextArea(outputArea, config);
  
  return [inputEditor,outputEditor];
}

function clearErrors( editor ) {
  editor.clearGutter( GUTTER_ID ); 
  editor.getAllMarks().forEach(mark => mark.clear());
}

function showTooltip(e, msg) {
  var tt = document.createElement("div");
  tt.className = "compiler-error-tooltip";
  tt.appendChild(document.createTextNode(msg));
  document.body.appendChild(tt);

  function position(e) {
    if(!tt.parentNode) return CodeMirror.off(document, "mousemove", position);
    tt.style.top = Math.max (0, e.clientY - tt.offsetHeight - 5) + "px";
    tt.style.left = (e.clientX + 5) + "px";
  }

  CodeMirror.on(document, "mousemove", position);
  position(e);
  if(tt.style.opacity != null) tt.style.opacity = 1;
  return tt;
}

function rm(el) {
  if(el.parentNode) el.parentNode.removeChild(el);
}

function hideTooltip(tt) {
  if(!tt.parentNode) return;
  if(tt.style.opacity == null) rm(tt);
  tt.style.opacity = 0;
  setTimeout(()=>rm(tt),600);
}

function showTooltipFor( e, msg, marker ) {
  var tooltip = showTooltip(e, msg);
  function hide() {
    CodeMirror.off(marker, "mouseout", hide);
    if(tooltip) { hideTooltip(tooltip); tooltip = null; }
  }
  CodeMirror.on(marker, "mouseout", hide);
}

function makeMarker( msg ) {
  var marker = document.createElement("div");
  marker.classList.add("compiler-error-marker","fa","fa-times-circle","fa-fw");

  CodeMirror.on(marker, "mouseover", function(e) {
    showTooltipFor(e, msg, marker);
  });

  return marker;
}

function setErrorMarker( editor, error ) {
  var loc = error.loc;
  var offset = error.loc.offset();
  var mark = editor.markText(
    {line: loc.line-1,ch:loc.column},
    {line: offset.line-1,ch:isNaN(offset.column) ? null : offset.column},
    {className: 'compiler-error-mark'}
  );
  editor.setGutterMarker(error.loc.line - 1, GUTTER_ID, makeMarker(error.message));
}

function setErrorMarkers( editor, errors ) {
  errors.forEach( error => setErrorMarker( editor, error ) );
}

export default {
  create,
  setErrorMarker,
  setErrorMarkers,
  clearErrors
};
