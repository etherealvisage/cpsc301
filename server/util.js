var url = require('url');

// Extract the portion of the URL after the host and before the query string.
exports.extractPath = function(request) {
  return url.parse(request.url).pathname;
}
