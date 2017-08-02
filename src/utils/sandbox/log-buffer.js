import { complexFormatter } from 'utils';

export default class LogBuffer {
  constructor() {
    this.buffer = [];
  }

  flush() {
    let buffer = [...this.buffer];

    this.buffer.length = 0;

    return buffer;
  }

  append(...args) {
    const arg = complexFormatter(...args);
    this.buffer.push(arg);
  }
}