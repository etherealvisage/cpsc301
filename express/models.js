var sqlite3 = require('sqlite3').verbose();
var config = require('./config');

var Discussion = function() {
  this._tbl = 'discussions';
};
exports.Discussion  = Discussion;

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
