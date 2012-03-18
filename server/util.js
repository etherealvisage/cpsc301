var config = require('./config');
var path = require('path');
var url = require('url');

// Extract the portion of the URL after the host and before the query string.
exports.extractPath = function(request) {
  return url.parse(request.url).pathname;
}

exports.resolveStaticDirPath = function() {
  return path.resolve(__dirname, config.static_path);
}

// Return the MIME type corresponding to the provided file extension, or a
// default MIME type if none is found.
exports.lookupMimeType = function(extension) {
  extension = extension.toLowerCase();
  if(extension in config.mime_types)
    return config.mime_types[extension];
  return config.mime_types['default'];
}
