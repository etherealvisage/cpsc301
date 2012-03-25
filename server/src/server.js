var config = require("./config");
var path = require("path");
var querystring = require("querystring");
var fs = require("fs");
var router = require("router");
var server = router();

server.listen(config.listenPort);

exports.router = server;

exports.getPOST = function(request, callback) {
  var postData = "";
  request.addListener("data", function(chunk) {
    postData += chunk;
  });

  request.addListener("end", function() {
    var decoded = undefined;
    if(request.headers["content-type"] == "application/x-www-form-urlencoded") {
      decoded = querystring.parse(postData);
      callback(request, decoded);
    }
    else {
      callback(request, postData);
    }
  });
}

exports.serveAsJSON = function(response, object) {
  response.writeHead(200, {"content-type": "application/json"});
  response.write(JSON.stringify(object));
  response.end();
}

exports.serveStatic = function(response, urlpath) {
  /* TODO: make this more robust. */
  var filePath = path.resolve(path.join(config.staticPath, urlpath));

  if(/*filePath.indexOf(config.staticPath) !== 0 ||*/ !path.existsSync(filePath)) {
    console.log(filePath.indexOf(config.staticPath));
    response.writeHead(404, {
      'Content-Type': 'application/octet-stream'
    });
    response.end("File not found");
    return;
  }

  var extension = path.extname(filePath);
  var typemap = {
    ".html": "text/html",
    ".css": "text/css",
    ".png": "image/png",
    ".js": "application/javascript"
  };
  response.writeHead(200, {
//    'Content-Type': 'application/octet-stream'
    "Content-Type": typemap[extension]
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

