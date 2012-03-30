var sqlite3 = require('sqlite3').verbose();
var config = require('./config');
var crypto = require('crypto');

var db = new sqlite3.Database(config.dbPath);
db.run("PRAGMA foreign_keys = ON");

/* TODO: call dbCleanup on SIG{INT,KILL,TERM}. */
function dbCleanup() {
  console.log("Closing database connection.");
  db.close();
}


/*==============
  Authentication
  ==============*/
var Authentication = function() {
};
exports.Authentication = Authentication;

Authentication.prototype._getUserDetailsQuery = 
  db.prepare("SELECT * FROM " + config.dbTablePrefix + "users WHERE username = ? AND locked == 0");
Authentication.prototype._addTokenQuery =
  db.prepare("INSERT INTO " + config.dbTablePrefix + "sessions VALUES(?, ?)");
Authentication.prototype._validateCookieQuery =
  db.prepare('SELECT COUNT(token) AS tokenCount FROM ' + config.dbTablePrefix + 'sessions WHERE token = ? AND userID = ?');
Authentication.prototype._logoutQuery =
  db.prepare('DELETE FROM sessions WHERE token = ?');

Authentication.prototype.validateCookie = function(session, uid, onValid, onInvalid) {
  var validateCookieQuery = this._validateCookieQuery;

  db.serialize(function() {
    validateCookieQuery.get(session, uid, function(err, row) {
      if(err !== null)
        throw err;

      if(row.tokenCount > 0 && typeof onValid !== 'undefined')
        onValid();
      else if(typeof onInvalid !== 'undefined')
        onInvalid();
    });
  });
};

Authentication.prototype.login = function(username, password, onResult) {
  var getQuery = this._getUserDetailsQuery;
  var addQuery = this._addTokenQuery;
  var self = this;
  db.serialize(function() {
    getQuery.get(username, function(err, row) {
      if(err !== null)
        throw err;

      if(typeof row === "undefined") {
        onResult({state: "notFound"});
      } else {
        var pwHash = self._generateHash(password, row.pwsalt);
        if(pwHash === row.pwhash) {
          var token = self._generateToken();
          addQuery.run(row.id, token);
          onResult({
            state: "success",
            token: token,
            userID: row.id,
            name: row.name,
            username: row.username,
            userType: row.userType,
          });
        } else {
          onResult({state: "failed"});
        }
      }
    });
  });
};

Authentication.prototype.logout = function(session) {
  var logoutQuery = this._logoutQuery;
  db.serialize(function() {
    logoutQuery.run(session, function(err) {
      if(err !== null)
        throw err;
    });
  });
};

Authentication.prototype._generateHash = function(password, salt) {
  var hasher = crypto.createHash('sha512');
  hasher.update(salt + password);
  return hasher.digest('hex');
};

Authentication.prototype._generateToken = function() {
  var hasher = crypto.createHash('sha512');
  hasher.update("" + (new Date()).getTime());
  return hasher.digest('hex');
};


/*====
  Memo
  ====*/
var Memo = function() {
};
exports.Memo = Memo;

Memo.prototype._listQuery =
  db.prepare("SELECT id, title, postDate FROM " + config.dbTablePrefix + "memos");
Memo.prototype._getQuery =
  db.prepare("SELECT * FROM " + config.dbTablePrefix + "memos WHERE id = ?");
Memo.prototype._createQuery =
  db.prepare("INSERT INTO " + config.dbTablePrefix +
    "memos VALUES (NULL, ?, 0, strftime('%s', 'now'), ?)");
Memo.prototype._updateQuery =
  db.prepare("UPDATE memos SET content=? WHERE id=?");
Memo.prototype._checkReadQuery = 
  db.prepare("SELECT * FROM unreadMemos WHERE userID = ?");

Memo.prototype.list = function(uid, onResults) {
  var listQuery = this._listQuery;
  var checkQuery = this._checkReadQuery;
  db.serialize(function() {
    checkQuery.all(uid, function(err, rows) {
      if(err !== null)
        throw err;

      var unread = {};
      for(var i = 0; i < rows.length; i ++) {
        unread[rows[i].memoID] = true;
      }
      listQuery.all(function(err, rows) {
        for(var i = 0; i < rows.length; i ++) {
          if(unread[rows[i].id] == true) rows[i].unread = true;
          else rows[i].unread = false;
        }
        onResults(rows);
      });
    });
  });
}

Memo.prototype.get = function(params, onResults) {
  var q = this._getQuery;
  db.serialize(function() {
    q.get(params.id, function(err, row) {
      if(err !== null)
        throw err;

      onResults(row);
    });
  });
}

Memo.prototype.create = function(params, onResult) {
  var q = this._createQuery;
  db.serialize(function() {
    q.run(params.title, params.content, function(err) {
      if(err !== null)
        throw err;
    });
    onResult(true);
  });
}

Memo.prototype.update = function(params, onResult) {
  var q = this._updateQuery;
  db.serialize(function() {
    q.run(params.content, params.id, function(err) {
      if(err !== null)
        throw err;
    });
    onResult(true);
  });
}

/*==================
  DiscussionRegistry
  ==================*/
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

/*==========
  Discussion
  ==========*/
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

/*====
  Post
  ====*/
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
