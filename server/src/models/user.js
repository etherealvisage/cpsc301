var config = require('../config');
var db = require('./index').db;

var User = function() {
};
exports.User = User;

User.prototype._getQuery = db.prepare(
  'SELECT * FROM ' + config.dbTablePrefix + 'users WHERE id=?');

User.prototype.get = function(uid, onResult) {
  var query = this._getQuery;
  db.serialize(function() {
    query.get(uid, function(err, row) {
      if(err !== null)
        throw err;

      // Build result manually rather than just returning row to prevent
      // sensitive data (e.g., pwhash, pwsalt) from being sent to user.
      var result = {};
      ['id', 'username', 'name', 'userType', 'creationDate'].forEach(function(key) {
        result[key] = row[key];
      });
      onResult(result);
    });
  });
};
