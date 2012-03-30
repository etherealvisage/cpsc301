var config = require('../config');
var db = require('./index').db;

var Discussion = function() {
};
exports.Discussion = Discussion;

Discussion.prototype._loadDiscussionQuery = db.prepare('SELECT * FROM ' + config.dbTablePrefix + 'discussions ' +
  'WHERE id=?');
Discussion.prototype._loadPostsQuery = db.prepare('SELECT * FROM ' + config.dbTablePrefix + 'posts ' +
  'WHERE discussionId=?');

Discussion.prototype.load = function(id, onLoad) {
  var query = this._loadDiscussionQuery;
  var self = this;
  db.serialize(function() {
    query.get(id, function(err, row) {
      if(err !== null)
        throw err;
      if(typeof row === 'undefined')
        throw 'No post with ID ' + id;

      self._params = row;
      self._loadPosts(function() {
        onLoad(self._params);
      });
    });
  });
};

Discussion.prototype._loadPosts = function(onLoad) {
  var query = this._loadPostsQuery;
  var self = this;
  db.serialize(function() {
    query.all(self._params.id, function(err, rows) {
      if(err !== null)
        throw err;
      self._params.posts = rows;
      onLoad();
    });
  });
};
