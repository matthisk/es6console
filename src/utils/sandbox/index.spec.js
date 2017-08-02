import SandBox, { sandbox, removeConsoleStatements, isExpression } from './index';

jest.mock('./worker', () => ({
  newWorker: () => {},
}));

jest.mock('compilers', () => ({
  'Babel (6)': {
    transform: function(code, options) {
      const babel = require('babel-core');
      
      return babel.transform(code, options);
    },
  }
}));

test('sandbox', () => {
  expect(sandbox).toBeInstanceOf(SandBox);
});

describe('removeConsoleStatements', () => {
  it('#works', () => {
    const result = removeConsoleStatements([
      'function test() {',
      '  console.log("hello world");',
      '}',
    ].join('\n'));

    expect(result.code).toBe('function test() {}');
  });

  it('#doesnt transform', () => {
    const result = removeConsoleStatements([
      'function test() {',
      '  let { x } = { x: 0 };',
      '  console.log("hello world");',
      '}',
    ].join('\n'));

    expect(result.code).toBe([
      'function test() {',
      '  let { x } = { x: 0 };',
      '}',
    ].join('\n'));
  });

  it('#fails', () => {
    expect(() => {
      removeConsoleStatements([
        'function test() {',
        '  console.log("hello world");',
        '',
      ].join('\n'));
    }).toThrow(SyntaxError);
  });
});

describe('isExpression', () => {
  it('#works', () => {
    expect(isExpression('1 + 1')).toBe(true);
    expect(isExpression('1 + 1;')).toBe(true);
    expect(isExpression('callMethod()')).toBe(true);
    expect(isExpression('let x = 0;')).toBe(false);
    expect(isExpression('const x = 0;')).toBe(false);
    expect(isExpression('var x = 0;')).toBe(false);
    expect(isExpression('var x, y, z;')).toBe(false);
    expect(isExpression('var { x } = { x: 0 };')).toBe(false);
    expect(isExpression([
      'function test() {',
      '  return 0;',
      '}'
    ].join('\n'))).toBe(false);

    expect(isExpression([
      '(function test() {',
      '  return 0;',
      '})()'
    ].join('\n'))).toBe(true);
  });

  it('#works on illegal input', () => {
    expect(isExpression('function f(a, b) {')).toBe(false);
    expect(isExpression('let x = {')).toBe(false);
  });
});