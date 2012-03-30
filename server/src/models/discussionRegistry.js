var config = require('../config');
var db = require('./index').db;

var DiscussionRegistry = function() {
};
exports.DiscussionRegistry = DiscussionRegistry;

DiscussionRegistry.prototype._listDiscussionsQuery = db.prepare("SELECT * FROM " + config.dbTablePrefix
  + "discussions");
DiscussionRegistry.prototype._createQuery =
  db.prepare("INSERT INTO " + config.dbTablePrefix + "discussions (title, rootPostID, tags) VALUES (?, 1, '')");

// List all discussions.
DiscussionRegistry.prototype.list = function(onResults) {
  var q = this._listDiscussionsQuery;

  db.serialize(function() {
    q.all(function(err, rows) {
      if(err !== null)
        throw err;
      onResults(rows);
    });
  });
};

// Create single discussion.
DiscussionRegistry.prototype.create = function(params) {
  var q = this._createQuery;

  db.serialize(function() {
    q.run(params.title, function(err) {
      if(err !== null)
        throw err;
    });
  });
};
