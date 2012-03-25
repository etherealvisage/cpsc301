var url = require("url");
var server = require("./server");

server.router.get("/", function(request, response) {
  server.serveStatic(response, "index.html");
});

server.router.all(function(request, response) {
  var pathname = url.parse(request.url).pathname;
  server.serveStatic(response, pathname);
});

