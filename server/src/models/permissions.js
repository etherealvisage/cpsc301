var config = require('../config');
var db = require('./index').db;

var Permissions = function() {
};
exports.Permissions = Permissions;

Permissions.prototype._getUserDetailsQuery = 
  db.prepare("SELECT * FROM " + config.dbTablePrefix + "users WHERE id = ?");
  
Permissions.prototype.check = function(userid, action, cb, context) {
  var getQuery = this._getUserDetailsQuery;
  db.serialize(function() {
    getQuery.get(userid, function(err, row) {
      if(err !== null)
        throw err;
      
      if(typeof row === "undefined") {
        cb(false);
        console.log("user not found");
      }else{
        var a = Actions[action];
        if(a === "undefined"){
          cb(false);
          console.log("action not found");
        }
        else{
          cb(a(row.userType, context));
        }
      }
    });
  });
};

var Actions = {
  // 0 = resident, 1 = doctor, 2 = admin

  createMemo: function(level, context){
    if(level === 2){
      return true; 
    }
    else{
      return false;
    }
  },
  editMemo: function(level, context){
    if(level === 2){
      return true; 
    }
    else{
      return false;
    }
  },
  
  createDiscussion: function(level, context){return true;},
  editDiscussion: function(level, context){
    if(level === 2){
      return true; 
    }
    else{
      return false;
    }
  },
  replyToDiscussion: function(level, context){return true;},
  
  createUser: function(level, context){
    if(level === 2){
      return true; 
    }
    else{
      return false;
    }
  },  
};
