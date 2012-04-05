var sqlite3 = require('sqlite3').verbose();
var config = require('../config');

var db = new sqlite3.Database(config.dbPath);
db.run("PRAGMA foreign_keys = ON");
exports.db = db;

/* TODO: call dbCleanup on SIG{INT,KILL,TERM}. */
function dbCleanup() {
  console.log("Closing database connection.");
  db.close();
}

var auth = require('./authentication');
var memo = require('./memo');
var discussionRegistry = require('./discussionRegistry');
var discussion = require('./discussion');
var post = require('./post');
var perm = require('./permissions');
exports.Authentication = auth.Authentication;
exports.Memo = memo.Memo;
exports.DiscussionRegistry = discussionRegistry.DiscussionRegistry;
exports.Discussion = discussion.Discussion;
exports.Post = post.Post;
exports.Permissions = perm.Permissions;
