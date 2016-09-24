var CodeMirror;
(function(name, definition) {
  if( typeof module !== 'undefined' && module.exports ) {
    CodeMirror = require('codemirror');
    module.exports = definition();
  } else if(typeof define !== 'undefined' && define.amd ) {
    define(definition);
  } else {
    CodeMirror = window.CodeMirror;
    this[name] = definition();
  }
})('Console',function(){
  class Console {
    constructor(element, options = {}) {
      options.theme = options.theme || 'eclipse';
      options.mode = options.mode || 'javascript';

      this.container = element;
      this.container.classList.add('jsconsole', options.theme);
      this.logBuffer = [];
      this.history = [];
      this.historyIndex = -1;
      this.events = {};

      var enter = () => {
        var text = this.input.getValue().trim();
        if (text) this.exec(text);
      };

      var shiftEnter = () => {
        CodeMirror.commands.newlineAndIndent(this.input);
      };

      var cancel = () => {
        // TODO: copy, not cancel when we hit ^C on windows with an active selection
        this.resetInput();
      };

      var clear = () => {
        this.output.setValue('');
      };

      var up = (cm, evt) => {
        var cursor = this.input.getCursor();
        if (cursor.line === 0 && cursor.ch === 0) {
          this.historyIndex++;
          if (this.historyIndex > (this.history.length - 1)) this.historyIndex = this.history.length - 1;
          this.resetInput(this.history[this.historyIndex]);
        } else {
          CodeMirror.commands.goLineUp(this.input);
        }
      };

      var down = (cm, evt) => {
        var cursor = this.input.getCursor();
        var lastLine = this.input.lastLine();
        if (cursor.line === lastLine) {
          this.historyIndex--;
          if (this.historyIndex < -1) this.historyIndex = -1;
          this.resetInput(this.history[this.historyIndex]);
        } else {
          CodeMirror.commands.goLineDown(this.input);
        }
      };

      var inputKeymap = {
        "Up": up,
        "Down": down,
        "Ctrl-C": cancel,
        "Enter": enter,
        "Shift-Enter": shiftEnter,
        "Ctrl-L": clear,
      };

      var outputContainer = document.createElement('div');
      var inputContainer = document.createElement('div');
      outputContainer.className = 'jsconsole-output';
      inputContainer.className = 'jsconsole-input';

      this.container.appendChild(outputContainer);
      this.container.appendChild(inputContainer);

      this.input = CodeMirror(inputContainer, {
        theme: options.theme,
        mode: options.mode,
        extraKeys: inputKeymap,
        tabSize: 2,
        indentUnit: 2,
        undoDepth: 100,
        lineWrapping: true,
        viewportMargin: Infinity,
        gutters: ['repl']
      });
      this.output = CodeMirror(outputContainer, {
        theme: options.theme,
        mode: options.mode,
        gutters: ['repl'],
        tabSize: 2,
        viewportMargin: Infinity,
        lineWrapping: true,
        indentUnit: 2,
        readOnly: true
      });
      this.resetOutput();

      this.input.on('focus', () => {
        var cursor = this.output.getCursor();
        this.output.setSelection(cursor, cursor);
      });
      this.output.on('focus', () => {
        var cursor = this.input.getCursor();
        this.input.setSelection(cursor, cursor);
      });

      this.output.on('keydown', (cm, evt) => {
        // if we start typing when the output is focused, send it to the input
        if (evt.metaKey || evt.ctrlKey) {
          if (evt.which === 67) { // ^C
            // don't need to do
            // anything here yet.
          } else if (evt.which === 86) { // ^V
            this.input.triggerOnKeyDown(evt);
          }
        } else {
          this.input.triggerOnKeyDown(evt);
          this.input.focus();
        }
      });

      // codemirror doesn't handle mouseup events, so need to bind to the container
      outputContainer.addEventListener('mouseup', (evt) => {
        if (this.output.getSelection().length === 0) {
          // need to defer the input focusing to get it to work.
          setTimeout(() => this.input.focus(), 0);
        }
      });

      this.input.setMarker = this.output.setMarker = function(line, el) {
        this.setGutterMarker(line, 'repl', el.cloneNode());
      };

      this.resetInput();
    }
    on(event, fn) {
      this.events[event] = fn;
    }
    off(event) {
      delete this.events[event];
    }
    trigger(event, data) {
      if (typeof this.events[event] === 'function') this.events[event](data);
    }
    flushLogBuffer() {
      if (this.logBuffer.length) {
        this.logBuffer.forEach((msg)=>{
          this.print(msg);
          this.origConsoleLog(msg);
        });
        this.logBuffer.length = 0;
      }
    }
    addHistory(text) {
      this.historyIndex = -1;
      this.history.unshift(text);
    }
    appendEntry(input, output) {
      this.trigger('entry', {input, output});
      var range = this.appendOutput(input.toString().trim());
      this.output.setMarker(range[0].line, previousCommand);
      for (let i = range[0].line; i <= range[1].line; i++) {
        if (i > range[0].line) this.output.setMarker(i, previousCommandContinuation);
        this.output.addLineClass(i, 'text', 'prev-command');
      }

      this.flushLogBuffer();

      var parsedOutput =  this.parseOutput(output);

      range = this.appendOutput(parsedOutput.formatted);
      var isError = parsedOutput.value instanceof Error;

      if (isError) {
        this.output.setMarker(range[0].line, errorMarker);
      } else {
        this.output.setMarker(range[0].line, completionValue);
      }
      for (let i = range[0].line; i <= range[1].line; i++) {
        this.output.addLineClass(i, 'text', 'completion-value');
        this.output.addLineClass(i, 'text', parsedOutput.class);
      }
      this.output.addLineClass(range[1].line, 'text', 'completion-value-end');
    }
    parseOutput(value) {
      var type = typeof value;
      if (value instanceof Error) type = 'error';
      if (value === null) type = 'null';
      var output = {
        value : value,
        type : type,
        class : 'type-' + type
      };

      switch (type) {
        case "string":
          output.formatted =  '"' + value + '"';
          output.class = "string";
          break;
        case "undefined":
          output.formatted = "undefined";
          break;
        case "null":
          output.formatted = "null";
          break;
        case "object":
        case "array":
          // Todo: pretty print object output
          output.formatted = JSON.stringify(value);
          break;
        case "error":
          output.formatted = value.message.trim();
          break;
        default:
          output.formatted = value.toString().trim();
      }
      return output;
    }
    evaluate(code) {
      var out = {};
      try {
        out.completionValue = eval.call(null, code);
      } catch(e) {
        out.error = true;
        out.completionValue = e;
        out.recoverable = (e instanceof SyntaxError && e.message.match('^Unexpected (token|end)'));
      }
      return out;
    }
    exec(text) {
      this.isEvaluating = true;
      var rv = this.evaluate(text);
      if (!rv) return;
      this.isEvaluating = false;
      var doc = this.input.getDoc();

      if (rv.error && !rv.recoverable) {
        this.appendEntry(text, rv.completionValue);
        this.addHistory(text);
        this.resetInput();
      } else if (rv.recoverable) {
        CodeMirror.commands.newlineAndIndent(this.input);
      } else {
        this.appendEntry(text, rv.completionValue);
        this.addHistory(text);
        this.resetInput();
      }

      doc.eachLine((line) => {
        if (line.lineNo() === 0) this.input.setMarker(line, prompt);
        else this.input.setMarker(line, promptContinuation);
      });
    }
    resetInput(text = '') {
      this.input.setValue(text.toString());
      this.input.execCommand('goDocEnd');
      this.input.setMarker(0, prompt);
    }
    resetOutput() {
      // magic number to make things align properly when there is no input;
      this.output.setSize(null, 8);
      this.output.setValue('');
    }
    appendOutput(text) {
      this.output.setSize(null, 'auto');
      var doc = this.output.getDoc();
      var range;
      if (doc.getLine(doc.lastLine()).match(/^\s*$/)) {
        range = append(this.output, text.toString());
      } else {
        range = append(this.output, '\n' + text.toString());
        range[0].line = range[0].line + 1;
      }
      //this.output.markText(range[0], range[1], {className : 'output'});

      return range;
    }
    print(text, className = 'message', gutterMarker = document.createElement('span')) {
      var range = this.appendOutput(text);
      for (let i = range[0].line; i <= range[1].line; i++) {
        this.output.addLineClass(i, 'text', className);
        this.output.setMarker(i, gutterMarker);
      }
      return range;
    }
    // basic, dumb formatter for console.log style %X formatting
    simpleFormatter(msg, ...args) {
      if( typeof msg === 'string' ) {
        var replacementIndex = 0;
        return msg.replace(/%./mg,function(pattern, loc, originalString){
          return args[replacementIndex++];
        });
      } else {
        return msg + args; 
      }
    }

    complexFormatter( ...args ) {
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
        res = s;
      } else {
        args.forEach(arg => {
          if( typeof arg === 'object' ) res += `${JSON.stringify(arg)} `;
          else res += `${arg} `;
        });
      }
      return res;
    }

    appendInput(text) {
      return append(this.input, text.toString());
    }
    wrapLog(console) {
      var origConsoleLog = console.log.bind(console);
      console.log = (...args) => {
        this.logBuffer.push(this.complexFormatter(...args));
        if (!this.isEvaluating) {
          this.flushLogBuffer();
        }
      };
      return this.origConsoleLog = origConsoleLog;
    }
    setMode(mode) {
      this.input.setOption("mode", mode);
      this.output.setOption("mode", mode);
    }
    setTheme(theme) {
      this.input.setOption("theme", theme);
      this.output.setOption("theme", theme);
    }
  }

  var prompt = document.createElement('span'),
    promptContinuation = document.createElement('span'),
    errorMarker = document.createElement('span'),
    infoMarker = document.createElement('span'),
    previousCommand = document.createElement('span'),
    previousCommandContinuation = document.createElement('span'),
    completionValue = document.createElement('span');

  errorMarker.className = 'console-error gutter-icon';
  infoMarker.className = 'console-info gutter-icon';
  prompt.className = 'prompt gutter-icon';
  promptContinuation.className = 'prompt-continuation gutter-icon';
  previousCommand.className = 'prev-command gutter-icon';
  previousCommandContinuation.className = 'prev-command-continuation gutter-icon';
  completionValue.className = 'completion-value gutter-icon';

  function append(cm, text) {
    var doc = cm.getDoc();

    var lastLine = doc.lastLine();
    var line = doc.getLine(lastLine); // get the line contents
    var pos = CodeMirror.Pos(lastLine, line.length + 1);
    doc.replaceRange(text, pos); // adds a new line
    return [pos, CodeMirror.Pos(doc.lastLine())]
  }

  return Console;
});
