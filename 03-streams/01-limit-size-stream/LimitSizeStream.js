const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor({ limit, ...options }) {
    super(options);

    this.limit = limit;
    this.deliveredSize = 0;
  }

  _transform(chunk, encoding, callback) {
    this.deliveredSize += chunk.length;
    const error = this.deliveredSize > this.limit ? new LimitExceededError() : null;
    const nextChunk = error ? null : chunk;
    callback(error, nextChunk);
  }
}

module.exports = LimitSizeStream;
