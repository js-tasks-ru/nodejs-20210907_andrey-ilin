const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.bufferStr = '';
  }

  _transform(chunk, encoding, callback) {
    const chunkStr = chunk.toString();
    let endsOnEOL = false;
    if (chunkStr.indexOf(os.EOL) < 0) {
      this.bufferStr = this.bufferStr + chunkStr;
      callback(null);
      return;
    } else {
      endsOnEOL = chunkStr[chunk.length - 1] === os.EOL;
    }

    const splittedStr = chunkStr.split(os.EOL);
    
    splittedStr.forEach((subStr, index, arr) => {
      if (index === 0) {
        this.push(this.bufferStr + subStr);
        this.bufferStr = '';
      } else if (index < arr.length - 1) {
        this.push(subStr);
      } else if (endsOnEOL) {
        this.push(subStr);
      } else {
        this.bufferStr = subStr;
      }
    })
    callback(null);
  }

  _flush(callback) {
    callback(null, this.bufferStr);
  }
}

module.exports = LineSplitStream;
