var sqlite3 = require('sqlite3').verbose();
var config = require('../config');

var db = new sqlite3.Database(config.dbPath);
db.run("PRAGMA foreign_keys = ON");
// See https://github.com/developmentseed/node-sqlite3/issues/9#issuecomment-1977744.
db.run("PRAGMA journal_mode = WAL");
exports.db = db;

/* TODO: call dbCleanup on SIG{INT,KILL,TERM}. */
function dbCleanup() {
  console.log("Closing database connection.");
  db.close();
}

var auth = require('./authentication');
var memo = require('./memo');
var discussion = require('./discussion');
var perm = require('./permissions');
var user = require('./user');
exports.Authentication = auth.Authentication;
exports.Memo = memo.Memo;
exports.Discussion = discussion.Discussion;
exports.Permissions = perm.Permissions;
exports.User = user.User;
