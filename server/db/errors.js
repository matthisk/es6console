const util = require('util');

function DoesNotExist(message) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
}

util.inherits(DoesNotExist, Error);

module.exports = {
  DoesNotExist: DoesNotExist,
};