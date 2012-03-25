// This file contains configuration information that is independent from
// Express, and thus accessible from non-Express modules such as models.js.

var path = require('path');

exports.serverPort = 8888;
exports.staticDocPath = path.resolve(__dirname, '..', '..', 'webclient');
exports.staticDocMaxAge = 6*60*60*1000; // 6 hours
exports.dbPath = path.resolve(__dirname,  '..', 'misc', 'database.sqlite');
exports.dbTablePrefix = "";
