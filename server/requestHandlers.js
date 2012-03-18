var fs = require('fs');
var path = require('path');
var util = require('./util');

function listDiscussions(response, request) {
  var discussions = [
    {
      title: 'Under Your Spell',
      author: 'Desire',
    },
    {
      title: 'A Real Hero',
      author: 'College',
    }
  ];

  var response_body = JSON.stringify(discussions);

  response.writeHead(200, {'Content-Type': 'application/json'});
  response.write(response_body);
  response.end();
}

function serveRoot(response, request) {
  request.url = '/index.html';
  return serveStaticFile(response, request);
}

function serveStaticFile(response, request) {
  var staticDirPath = util.resolveStaticDirPath();
  var reqPath = util.extractPath(request);
  var filePath = path.resolve(path.join(staticDirPath, reqPath));

  if(
    filePath.indexOf(staticDirPath) !== 0 ||
    !path.existsSync(filePath)
  )
    return throwFileNotFound(response, request);

  var extension = path.extname(filePath);
  response.writeHead(200, {
    'Content-Type': util.lookupMimeType(extension),
    'Cache-Control': 'max-age=3600'
  });

  var readStream = fs.createReadStream(filePath);
  readStream.on('data', function(data) {
    response.write(data);
  });
  readStream.on('error', function(err) {
    throw err;
  });
  readStream.on('close', function() {
    response.end();
  });
}

function throwFileNotFound(response, request) {
  console.log('No ' + request.method + ' handler found for ' + util.extractPath(request));
  response.writeHead(404, {'Content-Type': 'text/plain'});
  response.write('404 Not Found');
  response.end();
}

exports.listDiscussions = listDiscussions;
exports.serveRoot = serveRoot;
exports.serveStaticFile = serveStaticFile;
exports.throwFileNotFound = throwFileNotFound;
