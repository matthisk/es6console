import { complexFormatter } from './log-formatters';

describe('complexFormatter', () => {
  it('(1) handles circular references', () => {
    const obj = { a: 1, b: 2 };
    obj.self = obj;

    const res = complexFormatter(obj);
    const parsed = JSON.parse(res);

    expect(parsed).toEqual({
      a: 1,
      b: 2,
      self: {},
    });
  });

  it('(2) handles circular references', () => {
    const obj = { a: 1, b: 2 };
    obj.deep = { c: 3, self: obj };

    const res = complexFormatter(obj);
    const parsed = JSON.parse(res);

    expect(parsed).toEqual({
      a: 1,
      b: 2,
      deep : {
        c: 3,
        self: {},
      },
    });
  });

  it('(3) handles circular references', () => {
    const obj = { obj: { a: 1, b: 2 } };
    obj.self = obj;

    const res = complexFormatter(obj);
    const parsed = JSON.parse(res);

    expect(parsed).toEqual({
      obj: { a: 1, b: 2 },
      self: {},
    });
  });

  it('handles strings', () => {
    const res = complexFormatter('hello', 'world');

    expect(res).toEqual('"hello" "world"');
  });

  it('handles numbers', () => {
    const res = complexFormatter(1, 2, 3);

    expect(res).toEqual('1 2 3');
  });

  it('(1) handles string interpolation', () => {
    const res = complexFormatter('%s %d %s', 1, 2, 3);

    expect(res).toEqual('1 2 3');
  });

  it('(2) handles string interpolation', () => {
    const res = complexFormatter('%s hello %d isame %s', 1, 2, 3);

    expect(res).toEqual('1 hello 2 isame 3');
  });
});