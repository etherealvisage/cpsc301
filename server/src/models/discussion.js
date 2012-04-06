var config = require('../config');
var db = require('./index').db;

var Discussion = function() {
};
exports.Discussion = Discussion;

Discussion.prototype._listQuery =
  db.prepare("SELECT * FROM " + config.dbTablePrefix +
    "discussions");

Discussion.prototype._createPostQuery =
  db.prepare("INSERT INTO " + config.dbTablePrefix +
    'posts VALUES(NULL, ?, strftime("%s", "now"), ?, ?)');

Discussion.prototype._createDiscussionQuery =
  db.prepare("INSERT INTO " + config.dbTablePrefix + 
    "discussions VALUES(NULL, ?, ?, ?)");

Discussion.prototype._setPostDiscussionQuery =
  db.prepare("UPDATE " + config.dbTablePrefix +
    "posts SET discussionID=? WHERE id=?");

Discussion.prototype._userNameQuery =
  db.prepare("SELECT name FROM " + config.dbTablePrefix +
    "users WHERE id = ?");

Discussion.prototype._listPostsQuery =
  db.prepare("SELECT * FROM " + config.dbTablePrefix +
    "posts WHERE discussionID = ?");

Discussion.prototype._getDiscussionQuery = 
  db.prepare("SELECT * FROM " + config.dbTablePrefix +
    "discussions WHERE id = ?");

Discussion.prototype._addPostQuery =
  db.prepare("INSERT INTO " + config.dbTablePrefix +
    'posts VALUES (NULL, ?, strftime("%s", "now"), ?, ?)');

Discussion.prototype.list = function(uid, onResults) {
  var listQuery = this._listQuery;
  var namesQuery = this._userNamesQuery;
  db.serialize(function() {
    listQuery.all(function(err, rows) {
      for(var i = 0; i < rows.length; i ++) {
        rows[i].unread = false;
        rows[i].authorName = "placeholder";
      }
      onResults(rows);
    });
  });
}

Discussion.prototype.createDiscussion = function(params, onResult) {
  var createDiscussionQuery = this._createDiscussionQuery;
  var createPostQuery = this._createPostQuery;
  var setPostDiscussionQuery = this._setPostDiscussionQuery;

  db.serialize(function() {
    createPostQuery.run(params.uid, params.content, -1, function(err) {
      var rootID = createPostQuery.lastID;

      createDiscussionQuery.run(params.title, rootID, params.uid, function(err) {
        var discussionID = createDiscussionQuery.lastID;
        setPostDiscussionQuery.run(discussionID, rootID, function(err) {
          onResult({discussionID: discussionID});
        });
      });
    });
  });
}

Discussion.prototype.addPost = function(params, onResult) {
  var addPostQuery = this._addPostQuery;
  db.serialize(function() {
    console.log("Running query.");
    console.log(params);
    addPostQuery.run(params.uid, params.body, params.discussionID, function(err) {
      onResult({});
    });
  });
}

Discussion.prototype.getDiscussion = function(id, onResult) {
  var listPostsQuery = this._listPostsQuery;
  var getDiscussionQuery = this._getDiscussionQuery;
  var result = {
    posts: new Array()
  };
  db.serialize(function() {
    getDiscussionQuery.get(id, function(err, row) {
      result.title = row.title;
      listPostsQuery.all(id, function(err, rows) {
        for(var i = 0; i < rows.length; i ++) {
          rows[i].authorName = "placeholder";
          result.posts.push(rows[i]);
        }
        onResult(result);
      });
    });
  });
}
