var config = require("./config");
var querystring = require("querystring");
var router = require("router");
var server = router();

server.all(function(req, res) {
  console.log("Default handler");
  res.writeHead(404, {"Content-Type": "text/plain"});
  res.end("File not found\n");
});

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

