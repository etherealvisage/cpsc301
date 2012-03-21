var http = require('http');
var config = require('./config');

// Start the HTTP server.
function start(route, handlers) {
  http.createServer(function(request, response) {
    request.addListener('end', function() {
      route(handlers, request, response);
    });
  }).listen(config.server_port, config.server_host);
}

exports.start = start;
