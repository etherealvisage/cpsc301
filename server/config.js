// Host to listen on.
exports.server_host = 'localhost';

// Port to listen on.
exports.server_port = 8888;

// Path to directory containing static files.
exports.static_path = '../webclient/'

// Mapping between file extensions and MIME types.
exports.mime_types = {
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  'default': 'application/octet-stream',
};
