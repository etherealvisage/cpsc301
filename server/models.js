var config = require('./config');
var sqlite3 = require('sqlite3').verbose();

var Discussion = function() {
  this._tbl = 'discussions';
};
exports.Discussion  = Discussion;

Discussion.prototype.list = function(on_results) {
  var db = new sqlite3.Database(config.db_file);
  var tbl = this._tbl;

  db.serialize(function() {
    var stmt = db.prepare('INSERT INTO ' + tbl + ' (title) VALUES (?)');
    for(var i = 0; i < 3; i++) {
      stmt.run('Socks ' + i);
    }
    stmt.finalize();

    db.all('SELECT * FROM ' + tbl, function(err, rows) {
      on_results(rows);
    });
  });

  db.close();
};
