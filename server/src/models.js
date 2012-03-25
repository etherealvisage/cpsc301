var sqlite3 = require('sqlite3').verbose();
var config = require('./config');

var db = new sqlite3.Database(config.dbPath);

/* TODO: call dbCleanup on SIG{INT,KILL,TERM}. */
function dbCleanup() {
  console.log("Closing database connection.");
  db.close();
}

var Authentication = function() {

};
exports.Authentication = Authentication;

Authentication.prototype.validateCookie = function(cookie, onValid, onInvalid) {
  onInvalid();
}

var Memo = function() {
  
};
exports.Memo = Memo;

Memo.prototype._listQuery = db.prepare("SELECT id, title FROM " + config.dbTablePrefix + "memos");
Memo.prototype._getQuery = db.prepare("SELECT * FROM " + config.dbTablePrefix + "memos WHERE id = ?");
Memo.prototype._createQuery =
  db.prepare("INSERT INTO " + config.dbTablePrefix + "memos VALUES (NULL, ?, DATETIME('now'), ?)");

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

Discussion.prototype._listQuery = db.prepare("SELECT * FROM " + config.dbTablePrefix + "discussions");
Discussion.prototype._createQuery =
  db.prepare("INSERT INTO " + config.dbTablePrefix + "discussions VALUES (NULL, ?)");

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
