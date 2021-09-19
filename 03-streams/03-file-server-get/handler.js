const fs = require('fs');

const fileDownloadHandler = (filepath, req, res) => {
    const fileReader = fs.createReadStream(filepath);

    fileReader.pipe(res);

    fileReader.on('error', (err) => {
        if (err.code === 'ENOENT') {
            res.statusCode = 404;
            res.end('file not found');
        } else {
            res.statusCode = 500;
            res.end('internal server error');
        }
    });

    fileReader.on('end', () => {
        res.end();
    });

    req.on('aborted', () => {
        fileReader.destroy();
    })
}

module.exports = fileDownloadHandler;