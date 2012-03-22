var http = require('http');
var querystring = require('querystring');
var config = require('./config');

// Start the HTTP server.
function start(route, handlers) {
  http.createServer(function(request, response) {
    var postData = '';
    if(request.method === 'POST') {
      // POST data's encoding must be specified as binary for it not to be
      // manipulated as a result of string encoding.
      request.setEncoding('binary');
      request.addListener('data', function(postDataChunk) {
        postData += postDataChunk;
      });
    }

    request.addListener('end', function() {
      var decoded_post = null;
      if(request.headers['content-type'] === 'application/x-www-form-urlencoded')
        decoded_post = querystring.parse(postData);
      route(handlers, request, response, decoded_post);
    });
  }).listen(config.server_port, config.server_host);
}

exports.start = start;
