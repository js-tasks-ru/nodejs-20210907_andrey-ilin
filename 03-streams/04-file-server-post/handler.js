const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const BITE_IN_MB = 1024 * 1024;

const createLimitSizeStream = (limit) => new LimitSizeStream({ limit });

const fileUploadHandler = (filepath, req, res) => {
    fs.stat(filepath, (err, stat) => {
        if (err && err.code === 'ENOENT') {
            const fileWriter = fs.createWriteStream(filepath);
            const limitStream = createLimitSizeStream(BITE_IN_MB);
            req.pipe(limitStream).pipe(fileWriter);

            limitStream.on('error', (err) => {
                if (err.code === 'LIMIT_EXCEEDED') {
                    fs.unlinkSync(filepath);
                    res.statusCode = 413;
                    res.end();
                }
            })

            fileWriter.on('finish', () => {
                res.statusCode = 201;
                res.end();
            });

            req.on('aborted', () => {
                fs.unlinkSync(filepath);
                fileWriter.destroy();
            });
        } else {
            res.statusCode = 409;
            res.end();
        }
    })
}

module.exports = fileUploadHandler;