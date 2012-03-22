// Host to listen on.
exports.server_host = '0.0.0.0';

// Port to listen on.
exports.server_port = 8888;

// Path to directory containing static files.
exports.static_path = '../../webclient/'

// Mapping between file extensions and MIME types.
exports.mime_types = {
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.ico': 'image/x-icon',
  'default': 'application/octet-stream',
};

// Path to SQLite database relative to server root directory.
exports.db_file = 'misc/database.sqlite';

// Time in seconds that HTTP agent will be instructed to cache static resources.
exports.http_caching_period = 6*60*60;
