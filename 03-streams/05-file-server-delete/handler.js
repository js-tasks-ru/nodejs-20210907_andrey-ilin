const fs = require('fs');

const fileDeleteHandler = (filepath, req, res) => {
    fs.stat(filepath, (err, stat) => {
        if (err && err.code === 'ENOENT') {
            res.statusCode = 404;
            res.end();    
        } else {
            fs.rm(filepath, { force: true }, () => {
                res.end();
            });
        }
    });
}

module.exports = fileDeleteHandler;