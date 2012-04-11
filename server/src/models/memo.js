var config = require('../config');
var db = require('./index').db;

var Memo = function() {
};
exports.Memo = Memo;

// select title, min(1, ifnull(unreadMemos.userID, 0)) from memos LEFT OUTER JOIN unreadMemos ON memos.id = unreadMemos.memoID WHERE (unreadMemos.userID IS NULL OR unreadMemos.userID = 3);

// Prepares memo queries for SQL
Memo.prototype._listQuery =
  db.prepare("SELECT m.*, u.name AS posterName, " + 
    "(SELECT COUNT() FROM " + config.dbTablePrefix + "unreadMemos AS ur WHERE " +
    "ur.userID = ? AND ur.memoID = m.id) AS unread FROM " + 
    config.dbTablePrefix + "memos AS m LEFT OUTER JOIN " + config.dbTablePrefix +
    "users AS u " + "ON m.posterID = u.id");

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

Memo.prototype.list = function(uid, onResults) {
  var listQuery = this._listQuery;
  var checkQuery = this._checkReadQuery;
  db.serialize(function() {
    checkQuery.all(uid, function(err, rows) {
      if(err !== null)
        throw err;

      listQuery.all(uid, function(err, rows) {
        onResults(rows);
      });
    });
  });
}

// Attempts to access a memo from given id inside the parameters. If not found, and error is thrown.
Memo.prototype.get = function(params, onResults) {
  var q = this._getQuery;
  var readQuery = this._markReadQuery;
  db.serialize(function() {
    q.get(params.id, function(err, row) {
      if(err !== null)
        throw err;
      if(typeof row === 'undefined') {
        onResults({ error: 'request' });
        return;
      }

      readQuery.run(params.id, params.userID);
      onResults(row);
    });
  });
}

// Attempts to create a new memo given appropriate parameters. Marks this memo as unread for all users
Memo.prototype.create = function(params, onResult) {
  var q = this._createQuery;
  var usersQuery = this._userListQuery;
  var unreadQuery = this._markUnreadQuery;
  db.serialize(function() {
    if(params.title === '' || params.content === '') {
      onResult({ error: 'request' });
      return;
    }

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

// Allowance of memo editing. Takes in new title and content for a specific memo and attempts to update the information 
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
