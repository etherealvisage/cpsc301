var models = require('../models');
var util = require("./util");

exports.getUser = function(req, res) {
  util.checkToken(req, res, function(uid) {
    var user = new models.User();
    user.get(uid, function(result) {
      res.json(result);
    });
  });
}

exports.createUser = function(req, res) {
  util.checkTokenAndPermission(req, res, "createUser", function() {
    var authenticator = new models.Authentication();
    var username = req.body.username;
    var name = req.body.name;
    var password = req.body.password;
    var userType = req.body.userType;

    authenticator.createUser(username, name, password, userType, function(data) {
      res.json({uid: data.uid});
    });
  });
}

exports.listUsers = function(req, res) {
  var authenticator = new models.Authentication();
  authenticator.listUsers(function(data) {
    res.json(data);
  });
}
