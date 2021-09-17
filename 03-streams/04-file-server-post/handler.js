const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const BITE_IN_MB = 1024 * 1024;

const createLimitSizeStream = (limit) => new LimitSizeStream({ limit });

const fileUploadHandler = (filepath, req, res) => {
    const fileWriter = fs.createWriteStream(filepath, {flags: 'wx'});
    const limitStream = createLimitSizeStream(BITE_IN_MB);
    req.pipe(limitStream).pipe(fileWriter);

    fileWriter.on('finish', () => {
        res.statusCode = 201;
        res.end('created');
    });

    limitStream.on('error', (err) => {
        if (err.code === 'LIMIT_EXCEEDED') {
            res.statusCode = 413;
            res.end('file too big');
        } else {
            res.statusCode = 500;
            res.end('internal error'); 
        }

        fileWriter.destroy();
        fs.unlink(filepath, (err) => {});
    })

    fileWriter.on('error', (err) => {
        if (err.code === 'EEXIST') {
            res.statusCode = 409;
            res.end('file exist');
        } else {
            res.statusCode = 500;
            res.end('internal error'); 
        }
    });

    req.on('aborted', () => {
        limitStream.destroy();
        fileWriter.destroy();
        fs.unlink(filepath, (err) => {});
    })
}

module.exports = fileUploadHandler;