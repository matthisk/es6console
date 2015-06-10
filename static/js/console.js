import Console from './ext/jsconsole';
import jsMode from 'codemirror/mode/javascript/javascript';

export default class CNSL extends Console {
  constructor( { element = "console-output" } = {} ) {
    super( document.getElementById(element), { mode: "javascript", theme: "eclipse" } );
    this.bindEventHandlers(); 
  }
  
  bindEventHandlers() {
    this.container.addEventListener("click",e => this.input.focus());
  }
}
