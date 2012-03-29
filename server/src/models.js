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

var Authentication = function() {

};
exports.Authentication = Authentication;

Authentication.prototype._getUserDetailsQuery = 
  db.prepare("SELECT * FROM " + config.dbTablePrefix + "users WHERE username = ? AND locked == 0");
Authentication.prototype._addTokenQuery =
  db.prepare("INSERT INTO " + config.dbTablePrefix + "sessions VALUES(?, ?)");
Authentication.prototype._validateCookieQuery =
  db.prepare('SELECT COUNT(token) AS tokenCount FROM ' + config.dbTablePrefix + 'sessions WHERE token = ?');
Authentication.prototype._logoutQuery =
  db.prepare('DELETE FROM sessions WHERE token = ?');

Authentication.prototype.validateCookie = function(cookie, onValid, onInvalid) {
  var validateCookieQuery = this._validateCookieQuery;

  db.serialize(function() {
    validateCookieQuery.get(cookie, function(err, row) {
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
      if(typeof row === "undefined") {
        onResult({state: "notFound"});
      } else {
        var pwHash = self.generateHash(password, row.pwsalt);
        if(pwHash === row.pwhash) {
          var token = self.generateToken();
          addQuery.run(row.id, token);
          onResult({
            state: "success",
            token: token,
            userId: row.id,
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
    logoutQuery.run(session, function(err) { });
  });
};

Authentication.prototype.generateHash = function(password, salt) {
  var hasher = crypto.createHash('sha512');
  hasher.update(salt + password);
  return hasher.digest('hex');
};

Authentication.prototype.generateToken = function() {
  var hasher = crypto.createHash('sha512');
  hasher.update("" + (new Date()).getTime());
  return hasher.digest('hex');
};

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

Memo.prototype.list = function(onResults) {
  var q = this._listQuery;
  db.serialize(function() {
    q.all(function(err, rows) {
      onResults(rows);
    });
  });
}

Memo.prototype.get = function(params, onResults) {
  var q = this._getQuery;
  db.serialize(function() {
    q.get(params.id, function(err, row) {
      onResults(row);
    });
  });
}

Memo.prototype.create = function(params, onResult) {
  var q = this._createQuery;
  db.serialize(function() {
    q.run(params.title, params.content);
    onResult(true);
  });
}
// TO DO:
// Create Discussion registry: Its purpose is to instantiate discussions
// Access info from the database
// Refactor and replace

// Create new discussion model
// Getpost methods on it

// Two instantiation model 
var DiscussionRegistry = function() {
};
exports.DiscussionRegistry = DiscussionRegistry;

DiscussionRegistry.prototype._listDiscussionsQuery = db.prepare("SELECT * FROM " + config.dbTablePrefix
  + "discussions");
DiscussionRegistry.prototype._listOneDiscussionQuery = db.prepare("SELECT * FROM " + config.dbTablePrefix
  + "discussions WHERE id= ?" );  
DiscussionRegistry.prototype._createQuery =
  db.prepare("INSERT INTO " + config.dbTablePrefix + "discussions VALUES (NULL, ?, 0, '')");

//Many discussions
DiscussionRegistry.prototype.listDiscussions = function(onResults) {
  var q = this._listDiscussionsQuery;

  db.serialize(function() {
    q.all(function(err, rows) {
     createManyDiscussions(rows);
      onResults(rows);
    });
  });
};

// Grab all information for a single discussion object
DiscussionRegistry.prototype.listOneDiscussion = function(onResults, id) {
  var q = this._listOneDiscussionQuery;
  
  db.serialize(function() {
    q.all(id, function(err, rows) {
      // Instantantiate a new discussion object
      createOneDiscussion(rows); //I added this for my own clarity
      //onResults(rows);
    });
  });
};

function createOneDiscussion(rows){
  // Call Discussion._create with rows
}

function createmanyDiscussions(rows){
  for(i=0 ;i <rows.length; i++){
      // Call Discussion._create with rows
  }
}

// Adding a new discussion into the database
DiscussionRegistry.prototype.create = function(params) {
  var q = this._createQuery;

  db.serialize(function() {
    q.run(params.title);
      });
};

var Discussion = function() {
};

exports.Discussion = Discussion;

/*CREATE TABLE posts (
  id INTEGER PRIMARY KEY,
  posterID INTEGER NOT NULL,
  postDate INTEGER NOT NULL,
  content TEXT NOT NULL,
  discussionID INTEGER NOT NULL,
  FOREIGN KEY(posterID) REFERENCES users(id),
  FOREIGN KEY(discussionID) REFERENCES discussions(id)
);
*/

Discussion.prototype._listPosts = db.prepare("SELECT * FROM " + config.dbTablePrefix
  + "posts"); 
Discussion.prototype._addPostQuery = db.prepare("SELECT * FROM " + config.dbTablePrefix
  + "posts");

// Create discussion object to be displayed
// Method one -> For creating ONE discussion 
Discussion.prototype.create = function(params) {
  
};


