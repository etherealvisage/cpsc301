var config = require('../config');
var db = require('./index').db;

var Discussion = function() {
};
exports.Discussion = Discussion;

// Prepare discussion queries
Discussion.prototype._listQuery =
  db.prepare("SELECT d.*, p.postDate AS postDate, u.name AS authorName FROM " + config.dbTablePrefix +
    "discussions AS d LEFT OUTER JOIN " + config.dbTablePrefix + "posts AS p " +
    "ON d.rootPostID = p.id LEFT OUTER JOIN " + config.dbTablePrefix + "users AS u "
    + "ON p.posterID = u.id");

Discussion.prototype._createPostQuery =
  db.prepare("INSERT INTO " + config.dbTablePrefix +
    'posts VALUES(NULL, ?, strftime("%s", "now"), ?, ?)');

Discussion.prototype._createDiscussionQuery =
  db.prepare("INSERT INTO " + config.dbTablePrefix + 
    "discussions VALUES(NULL, ?, ?, ?)");

Discussion.prototype._setPostDiscussionQuery =
  db.prepare("UPDATE " + config.dbTablePrefix +
    "posts SET discussionID=? WHERE id=?");

Discussion.prototype._listPostsQuery = 
  db.prepare("SELECT " + config.dbTablePrefix + "posts.*, " + config.dbTablePrefix +
    "users.name AS authorName FROM " + config.dbTablePrefix +
    "posts LEFT OUTER JOIN " + config.dbTablePrefix +
    "users ON " + config.dbTablePrefix + "posts.posterID = " +
    config.dbTablePrefix + "users.id WHERE discussionID = ?");

Discussion.prototype._getDiscussionQuery = 
  db.prepare("SELECT * FROM " + config.dbTablePrefix +
    "discussions WHERE id = ?");

Discussion.prototype._addPostQuery =
  db.prepare("INSERT INTO " + config.dbTablePrefix +
    'posts VALUES (NULL, ?, strftime("%s", "now"), ?, ?)');

// Takes in a discussion id, and returns a list of discussions
Discussion.prototype.list = function(uid, onResults) {
  var listQuery = this._listQuery;
  var namesQuery = this._userNamesQuery;
  db.serialize(function() {
    listQuery.all(function(err, rows) {
      for(var i = 0; i < rows.length; i ++) {
        rows[i].unread = false;
      }
      onResults(rows);
    });
  });
}

// Takes appropriate discussion parameters, including title and body, and creates a new discussion. The body inside of paramater becomes the first post
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

// Upon receiving a parameter with a discussion id, a new post is created and added as the last post in the selected discussion
Discussion.prototype.addPost = function(params, onResult) {
  var addPostQuery = this._addPostQuery;
  db.serialize(function() {
    addPostQuery.run(params.uid, params.body, params.discussionID, function(err) {
      onResult({});
    });
  });
}

// Takes a discussion ID and attempts to access the discussion. If not available, an error is thrown
Discussion.prototype.getDiscussion = function(id, onResult) {
  var listPostsQuery = this._listPostsQuery;
  var getDiscussionQuery = this._getDiscussionQuery;
  var result = {
    posts: new Array()
  };
  db.serialize(function() {
    getDiscussionQuery.get(id, function(err, row) {
      if(typeof row === 'undefined') {
        onResult({error: 'request'});
        return;
      }

      result.title = row.title;
      listPostsQuery.all(id, function(err, rows) {
        for(var i = 0; i < rows.length; i ++)
          result.posts.push(rows[i]);
        onResult(result);
      });
    });
  });
}
