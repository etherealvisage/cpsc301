var config = require('../config');
var db = require('./index').db;

var Memo = function() {
};
exports.Memo = Memo;

Memo.prototype._listQuery =
  db.prepare("SELECT id, title, postDate, posterID FROM " + config.dbTablePrefix + "memos");
Memo.prototype._getQuery =
  db.prepare("SELECT * FROM " + config.dbTablePrefix + "memos WHERE id = ?");
Memo.prototype._createQuery =
  db.prepare("INSERT INTO " + config.dbTablePrefix +
    "memos VALUES (NULL, ?, ?, strftime('%s', 'now'), ?)");
Memo.prototype._updateQuery =
  db.prepare("UPDATE memos SET content=?, title=? WHERE id=?");
Memo.prototype._checkReadQuery = 
  db.prepare("SELECT * FROM unreadMemos WHERE userID = ?");
Memo.prototype._markUnreadQuery = 
  db.prepare("INSERT INTO " + config.dbTablePrefix +
    "unreadMemos VALUES (?, ?)");
Memo.prototype._markReadQuery = 
  db.prepare("DELETE FROM " + config.dbTablePrefix +
    "unreadMemos WHERE memoID = ? AND userID = ?");
Memo.prototype._userListQuery =
  db.prepare("SELECT id FROM " + config.dbTablePrefix +
    "users");
Memo.prototype._userNamesQuery =
  db.prepare("SELECT id, name FROM " + config.dbTablePrefix +
    "users");
Memo.prototype._userNameQuery =
  db.prepare("SELECT name FROM " + config.dbTablePrefix +
    "users WHERE id = ?");

Memo.prototype.list = function(uid, onResults) {
  var listQuery = this._listQuery;
  var checkQuery = this._checkReadQuery;
  var namesQuery = this._userNamesQuery;
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
        var lrows = rows;
        namesQuery.all(function(err, rows) {
          var usernames = {};
          for(var i = 0; i < rows.length; i ++) {
            usernames[rows[i].id] = rows[i].name;
          }

          for(var i = 0; i < lrows.length; i ++) {
            lrows[i].posterName = usernames[lrows[i].posterID] || "someone";
          }
          onResults(lrows);
        });
      });
    });
  });
}

Memo.prototype.get = function(params, onResults) {
  var q = this._getQuery;
  var readQuery = this._markReadQuery;
  db.serialize(function() {
    q.get(params.id, function(err, row) {
      if(err !== null)
        throw err;

      readQuery.run(params.id, params.userID);

      onResults(row);
    });
  });
}

Memo.prototype.create = function(params, onResult) {
  var q = this._createQuery;
  var usersQuery = this._userListQuery;
  var unreadQuery = this._markUnreadQuery;
  db.serialize(function() {
    q.run(params.title, params.uid, params.content, function(err) {
      if(err !== null)
        throw err;

      var memoID = q.lastID;

      usersQuery.each(function(err, row) {
        unreadQuery.run(memoID, row.id, function(err) {
          if(err !== null)
            throw err;
        });
      }, function() {
        onResult({memoID: memoID});
      });
    });
  });
}

Memo.prototype.update = function(params, onResult) {
  var q = this._updateQuery;
  db.serialize(function() {
    q.run(params.content, params.title, params.id, function(err) {
      if(err !== null)
        throw err;
    });
    onResult(true);
  });
}
