import LogBuffer from './log-buffer';

jest.mock('utils', () => ({
  complexFormatter: (...args) => args
}));

describe('LogBuffer', () => {
  it('#append', () => {
    const logBuffer = new LogBuffer();

    logBuffer.append(1, 2, 3);

    expect(logBuffer.buffer).toEqual([[1, 2, 3]]);

    logBuffer.append(4, 5, 6);

    expect(logBuffer.buffer).toEqual([[1, 2, 3], [4, 5, 6]]);
  });

  it('#flush', () => {
    const logBuffer = new LogBuffer();

    logBuffer.append('hello world');
    logBuffer.append(1, 2, 3);
    logBuffer.append({
      a: 1,
      b: 2,
    });

    const log = logBuffer.flush();

    expect(logBuffer.buffer).toHaveLength(0);
    expect(log).toEqual([
      ['hello world'],
      [1, 2, 3],
      [{
        a: 1,
        b: 2,
      }]
    ]);
  });
});