var config = require('./config');
var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database(config.dbFile);

var Authentication = function() {

}
exports.Authentication = Authentication;

Authentication.prototype.create = function(params, callback) {
  db.serialize(function() {
    db.get("SELECT * FROM " + config.tablePrefix + "users WHERE username = ? LIMIT 1", params.username,
      function(err, row) {
        /* First step: check to see if the user exists . . . */
        if(row == undefined) {
          callback({token: "undef"});
        }
        /* Otherwise, check for validity. */
        /* TODO: implement proper hashing here. */
        else if(row.pwsalt + params.password == row.pwhash) {
          /* TODO: generate random session ID here. */
          var token = "token" + Math.random();
          db.serialize(function() {
            db.run("INSERT INTO sessions VALUES (?, ?)", token, row.id);
          });
          callback({token: token});
        }
        else {
          console.log(row.pwsalt + params.password);
          callback({token: "invalid"});
        }
    });
  });
};

Authentication.prototype.validate = function(params, callback) {
  
}

