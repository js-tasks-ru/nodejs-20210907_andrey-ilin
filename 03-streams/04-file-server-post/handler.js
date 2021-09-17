const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const BITE_IN_MB = 1024 * 1024;

const createLimitSizeStream = (limit) => new LimitSizeStream({ limit });

const fileUploadHandler = (filepath, req, res) => {
    fs.stat(filepath, (err, stat) => {
        if (err && err.code === 'ENOENT') {
            const fileWriter = fs.createWriteStream(filepath);
            const limitStream = createLimitSizeStream(BITE_IN_MB);
            req.on('error', (err) => {
                console.log('0 : ', err);
            })
            .pipe(limitStream)
            .on('error', (err) => {
                console.log('1 : ', err);
            })
            .pipe(fileWriter)
            .on('error', (err) => {
                console.log('1 : ', err);
            });

            limitStream.on('error', (err) => {
                if (err.code === 'LIMIT_EXCEEDED') {
                    fileWriter.destroy();
                    res.statusCode = 413;
                    res.end();
                    fs.unlink(filepath, (err) => {
                        if (err) {
                            console.error(err);
                        } else {
                           res.statusCode = 413;
                           res.end();
                        }
                     
                    });
                }
            })

            fileWriter.on('finish', () => {
                res.statusCode = 201;
                res.end();
            });

            req.on('aborted', () => {
                fs.unlink(filepath, (err) => {
                    if (err) {
                        console.error(err);
                    }
                    fileWriter.destroy();
                });
            });
        } else {
            res.statusCode = 409;
            res.end();
        }
    })
}

module.exports = fileUploadHandler;