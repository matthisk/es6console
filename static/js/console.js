import EventEmitter from './event';

var createLine = function( v = "", classes = [] ) {
    let line = document.createElement("div");

    line.innerHTML = v;
    line.classList.add( "line", ...classes );

    return line;
}

class History {
  constructor() {
    this.list = [];
    this.pos = 0;
  }
  
  add( v ) {
    this.list.push( v );
    this.pos = this.list.length;
  }

  up() {
    if( this.pos <= 0 ) {
      this.pos = -1;
      return "";
    } else {
      this.pos--;
      return this.list[ this.pos ];   
    }
  }

  down() {
    if( this.pos >= this.list.length - 1 ) {
      this.pos = this.list.length;
      return "";
    } else {
      this.pos++;
      return this.list[ this.pos ];
    }
  }
}

export default class Console extends EventEmitter {
  constructor( { output = "console-output", input = "console-input" } = {} ) {
    super();
    this.inputArea = document.getElementById(input);
    this.outputArea = document.getElementById(output);
    this.history = new History();

    this.createEventHandlers();
  }

  writeError( err ) {
    let line = createLine( err, ["error"] );
    this.outputArea.appendChild( line );
    this.outputArea.scrollTop = this.outputArea.scrollHeight;
  }

  writeLine( l ) {
    let line = createLine( l ); 
    this.outputArea.appendChild( line );
    this.outputArea.scrollTop = this.outputArea.scrollHeight;
  }

  clear() {
    this.inputArea.value = "";
  }
 
  createEventHandlers() {
    this.inputArea.onkeydown = this.onkeyup.bind(this);
  }

  run() {
    let val = this.inputArea.value;
    this.history.add( val );
    this.trigger("run", val);
  }

  upHistory() {
    let val = this.history.up();
    this.inputArea.value = val;
  }

  downHistory() {
    let val = this.history.down();
    this.inputArea.value = val;
  }

  onkeyup( event ) {
    switch( event.keyCode ) {
      case 13 : // Enter 
        event.preventDefault();
        this.run();
        return false;
      case 38 : // Up
        this.upHistory()
        break;
      case 40 : // Down
        this.downHistory()
        break;
    }
  }
}
