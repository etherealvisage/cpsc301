var sqlite3 = require('sqlite3').verbose();
var config = require('./config');

var db = new sqlite3.Database(config.dbPath);

/* TODO: call dbCleanup on SIG{INT,KILL,TERM}. */
function dbCleanup() {
  console.log("Closing database connection.");
  db.close();
}

var Memo = function() {
  
};
exports.Memo = Memo;

Memo.prototype._listQuery = db.prepare("SELECT id, title FROM " + config.dbTablePrefix + "memos");
Memo.prototype._getQuery = db.prepare("SELECT * FROM " + config.dbTablePrefix + "memos WHERE id = ?");

Memo.prototype.list = function(onResults) {
  var q = this._listQuery;
  db.serialize(function() {
    q.all(function(err, rows) {
      onResults(rows);
    });
  });
}

Memo.prototype.get = function(id, onResults) {
  var q = this._getQuery;
  db.serialize(function() {
    q.get(id, function(err, row) {
      onResults(row);
    });
  });
}

var Discussion = function() {
  this._tbl = 'discussions';
};
exports.Discussion = Discussion;

Discussion.prototype.list = function(onResults) {
  var db = new sqlite3.Database(config.dbPath);
  var tbl = this._tbl;

  db.serialize(function() {
    db.all('SELECT * FROM ' + tbl, function(err, rows) {
      onResults(rows);
    });
  });

  db.close();
};

Discussion.prototype.create = function(params) {
  var db = new sqlite3.Database(config.dbPath);
  var tbl = this._tbl;

  db.serialize(function() {
    db.run('INSERT INTO ' + tbl + ' (title) VALUES (?)', params.title);
  });

  db.close();
}
