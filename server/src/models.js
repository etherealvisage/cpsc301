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

Authentication.prototype.validateCookie = function(cookie, onValid, onInvalid) {
  onValid();
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

var Discussion = function() {
};
exports.Discussion = Discussion;

Discussion.prototype._listQuery = db.prepare("SELECT * FROM " + config.dbTablePrefix
  + "discussions");
Discussion.prototype._createQuery =
  db.prepare("INSERT INTO " + config.dbTablePrefix + "discussions VALUES (NULL, ?, 0, '')");

Discussion.prototype.list = function(onResults) {
  var q = this._listQuery;

  db.serialize(function() {
    q.all(function(err, rows) {
      onResults(rows);
    });
  });
};

Discussion.prototype.create = function(params) {
  var q = this._createQuery;

  db.serialize(function() {
    q.run(params.title);
  });
}
