// This is the model for user authentication. Authenticates the user, deals with logins, password hashing and interaction with the database
var config = require('../config');
var db = require('./index').db;
var crypto = require("crypto");


var Authentication = function() {
};
exports.Authentication = Authentication;

// SQL query preparation
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

// Validates cookie for user session. Based on validation, calls appropriate methods
Authentication.prototype.validateCookie = function(session, uid, onValid, onInvalid) {
  var validateCookieQuery = this._validateCookieQuery;

  db.serialize(function() {
    validateCookieQuery.get(session, uid, function(err, row) {
      if(err !== null)
        throw err;

      if(row.tokenCount > 0 && typeof onValid !== 'undefined')
        onValid(uid, session);
      else if(typeof onInvalid !== 'undefined')
        onInvalid(uid, session);
    });
  });
};

// Attempts to login a user. If the password is correct, a token is generated. If not, the appropriate error is called.
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

// Ends the current session for the user
Authentication.prototype.logout = function(session) {
  var logoutQuery = this._logoutQuery;
  db.serialize(function() {
    logoutQuery.run(session, function(err) {
      if(err !== null)
        throw err;
    });
  });
};

// Attempts to add a new user to the database. Takes the given password and hashes it
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

// Lists all current users 
Authentication.prototype.listUsers = function(onResults) {
  var self = this;
  var listQuery = this._listUsersQuery;
  db.serialize(function() {
    listQuery.all(function(err, rows) {
      onResults(rows);
    });
  });
}

// Takes the password and salt, and returns a hash function
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

