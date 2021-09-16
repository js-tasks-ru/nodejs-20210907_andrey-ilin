const url = require('url');
const http = require('http');
const path = require('path');

const fileUploadHandler = require('./handler');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  if (pathname.indexOf('/') >= 0) {
    res.statusCode = 400;
    res.end();
    return;
  }

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      fileUploadHandler(filepath, req, res);
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
