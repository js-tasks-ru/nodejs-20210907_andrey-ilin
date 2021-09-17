const fs = require('fs');

const fileDeleteHandler = (filepath, req, res) => {
    fs.unlink(filepath, (err) => {
        if (!err) {
            res.end();
        } else {
            if (err.code === 'ENOENT') {
                res.statusCode = 404;
                res.end();     
            } else {
                res.statusCode = 500;
                res.end();  
            }
        }
       
    });
}

module.exports = fileDeleteHandler;