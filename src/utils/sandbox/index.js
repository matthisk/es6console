import Compilers from 'compilers';

import { newWorker } from './worker';

export const NO_COMPLETION_VALUE = 'ES6CONSOLE_NO_COMPLETION_VALUE';

export function removeConsoleStatements(code) {
  let compiler = Compilers['Babel (6)'];

  return compiler.transform(code, {
    presets: [],
    plugins: ['transform-remove-console'],
  });
}

export function isExpression(code) {
  let compiler = Compilers['Babel (6)'];
  let result;

  try {
    result = compiler.transform(code, {
      ast: true,
      plugins: [],
      presets: [],
    });
  } catch (e) {
    return false;
  }

  return result.ast.program.body[0].type === 'ExpressionStatement';
}

export function createError(e) {
  const result = {};

  result.recoverable =
        (e instanceof SyntaxError) &&
        e.message.match('Unexpected (token|end)');
  result.error = true;
  result.completionValue = new Error(e.message);

  return result;
}

export default class SandBox {
  static defaultOptions = {
    workerTimeout: 2500,
    hideCompletionValue: true,
    runtime: '',
  };
  
  async evaluate(code, options) {
    const opts = Object.assign({}, SandBox.defaultOptions, options);

    let result = await this._execute(code, opts);

    if (opts.hideCompletionValue && ! result.out.error) {
      result.completionValue = NO_COMPLETION_VALUE;
    }

    return result;
  }

  async evaluateExpression(code, options) {
    const opts = Object.assign({}, SandBox.defaultOptions, options);

    try {
      opts.runtime = removeConsoleStatements(opts.runtime).code;
    } catch (e) {
      return {
        out: createError(e),
        logBuffer: [],
      };
    }

    let statement = code;

    if (isExpression(code)) {
      statement = `self.__consoleEXPR = ${code};`;
    }

    return this._execute(statement, opts);
  }

  async _execute(code, opts) {
    let result = {};

    // 1: Run the code

    try {
      result = await newWorker(code, opts);
    } catch (e) {
      // 1.5 : Handle errors

      result.out = createError(e);
      result.logBuffer = [];
    }

    // 2: Return the result

    return result;
  }
}

export const sandbox = new SandBox();
