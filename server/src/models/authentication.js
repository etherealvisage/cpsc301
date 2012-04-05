var config = require('../config');
var db = require('./index').db;
var crypto = require("crypto");

var Authentication = function() {
};
exports.Authentication = Authentication;

Authentication.prototype._getUserDetailsQuery = 
  db.prepare("SELECT * FROM " + config.dbTablePrefix + "users WHERE username = ? AND locked == 0");
Authentication.prototype._addTokenQuery =
  db.prepare("INSERT INTO " + config.dbTablePrefix + "sessions VALUES(?, ?)");
Authentication.prototype._validateCookieQuery =
  db.prepare('SELECT COUNT(token) AS tokenCount FROM ' + config.dbTablePrefix + 'sessions WHERE token = ? AND userID = ?');
Authentication.prototype._logoutQuery =
  db.prepare('DELETE FROM sessions WHERE token = ?');
Authentication.prototype._createUserQuery =
  db.prepare("INSERT INTO " + config.dbTablePrefix +
    "users VALUES (NULL, ?, ?, ?, ?, ?, strftime('%s', 'now'), 0)");
Authentication.prototype._listUsersQuery =
  db.prepare("SELECT id, username, name, userType FROM " + config.dbTablePrefix +
    "users");

Authentication.prototype.validateCookie = function(session, uid, onValid, onInvalid) {
  var validateCookieQuery = this._validateCookieQuery;

  db.serialize(function() {
    validateCookieQuery.get(session, uid, function(err, row) {
      if(err !== null)
        throw err;

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
      if(err !== null)
        throw err;

      if(typeof row === "undefined") {
        onResult({state: "notFound"});
      } else {
        var pwHash = self._generateHash(password, row.pwsalt);
        if(pwHash === row.pwhash) {
          var token = self._generateToken();
          addQuery.run(row.id, token, function(err) {
            if(err !== null)
              throw err;
          });
          onResult({
            state: "success",
            token: token,
            userID: row.id,
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
    logoutQuery.run(session, function(err) {
      if(err !== null)
        throw err;
    });
  });
};

Authentication.prototype.createUser = function(username, name, password, userType, onResult) {
  var self = this;
  var createQuery = this._createUserQuery;
  db.serialize(function() {
    /* Reuse the `generate token' function to create a salt. */
    var salt = self._generateToken();
    var pwhash = self._generateHash(password, salt);
    createQuery.run(username, name, pwhash, salt, userType, function(err) {
      onResult({uid: createQuery.lastID});
    });
  });
}

Authentication.prototype.listUsers = function(onResults) {
  var self = this;
  var listQuery = this._listUsersQuery;
  db.serialize(function() {
    listQuery.all(function(err, rows) {
      onResults(rows);
    });
  });
}

Authentication.prototype._generateHash = function(password, salt) {
  var hasher = crypto.createHash('sha512');
  hasher.update(salt + password);
  return hasher.digest('hex');
};

Authentication.prototype._generateToken = function() {
  var hasher = crypto.createHash('sha512');
  hasher.update("" + (new Date()).getTime());
  return hasher.digest('hex');
};

