var config = require('../config');
var db = require('./index').db;

var Post = function() {
};
exports.Post = Post;

Post.prototype._createPostQuery = db.prepare('INSERT INTO ' + config.dbTablePrefix + 'posts ' +
  "(posterID, postDate, body, discussionId) VALUES (?, datetime('now'), ?, ?)");

Post.prototype.create = function(params) {
  var query = this._createPostQuery;
  db.serialize(function() {
    var posterId = 1; // Temporarily hard-coded.
    query.run(posterId, params.body, params.discussionId, function(err) {
      if(err !== null)
        throw err;
    });
  });
};
