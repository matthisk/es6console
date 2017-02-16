import Compilers from 'compilers'

import {
    logCall
} from 'store/ide'
import {
    complexFormatter
} from 'utils'

// Disable modules so we do not insert use-strict
// on the first line.
const ES2015 = ['es2015', {
    modules: false
}];

import runtimeScript from 'raw-loader!babel-polyfill/dist/polyfill.js';

class LogBuffer {
    constructor() {
        this.buffer = [];
    }

    flush() {
        let buffer = [...this.buffer];
        
        this.buffer.length = 0;

        return buffer;
    }

    append(...args) {
        this.buffer.push(...args);
    }
}

export default class SandBox {
    constructor() {
        this.logBuffer = new LogBuffer();

        var body = document.getElementsByTagName('body')[0];
        this.frame = document.createElement('iframe');
        this.frame.setAttribute('style', 'display: none');
        this.frame.onerror = this._handleError.bind(this);
        body.appendChild(this.frame);

        // this.cnsl.wrapLog(this.frame.contentWindow.console);

        this._wrapLog(this.frame.contentWindow.console);

        // Todo: Load runtimeScript async
        var script = this.frame.contentDocument.createElement('script');
        script.type = 'text/javascript';
        script.text = runtimeScript;
        this.frame.contentDocument.body.appendChild(script);

    }

    _handleError(e) {
        debugger;
    }
 
    _wrapLog(console) {
        var origConsoleLog = console.log.bind(console);

        console.log = (...args) => {
            const formattedLog = complexFormatter(...args);

            this.logBuffer.append(formattedLog);

            origConsoleLog(...args);
        };

        return this.origConsoleLog = origConsoleLog;
    }

    updateUserCode(code, onlyUpdate = false) {
        if (onlyUpdate && this.userCode && this.userCode.innerHTML == code) {
            return;
        }

        if (this.userCode) {
            this.frame.contentDocument.body.removeChild(this.userCode);
        }

        try {
            this.userCode = this.frame.contentDocument.createElement('script');
            this.userCode.type = 'text/javascript';
            this.frame.contentDocument.body.appendChild(this.userCode);

            this.userCode.innerHTML = code;
        } catch (e) {
            console.error([
                'Error in user code:',
                e.message,
            ].join('\n'));
        }

        // We are not interested in log statements
        // originated from updating the runtime
        this.logBuffer.flush();
    }

    runCode(code) {
        let out = {
            logBuffer: [],
            completionValue: null,
        };
        let compiler = Compilers['Babel (6)'];

        try {
            code = compiler.compile(code, {
                presets: [ES2015]
            }).code;
            out.completionValue = this.frame.contentWindow.eval.call(null, code);
        } catch (e) {
            out.error = true;
            if (e instanceof this.frame.contentWindow.Error) {
                out.completionValue = window[e.name](e.message); 
                // e is an instance of an Error object from the
                // frames window object
            } else {
                out.completionValue = new Error(e);
            }
            out.recoverable = ((e instanceof SyntaxError || e instanceof this.frame.contentWindow.SyntaxError) && e.message.match('Unexpected (token|end)'));
        }

        out.logBuffer = this.logBuffer.flush();

        return out;
    }
}

export const sandbox = new SandBox();