var config = require('../config');
var db = require('./index').db;

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
