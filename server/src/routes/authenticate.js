var crypto = require('crypto');
var models = require('../models');

exports.login = function(req, res) {
  var authenticator = new models.Authentication();
  authenticator.login(req.body.username, req.body.password, function(result) {
    if(result.state === 'success')
      res.cookie('session', result.token, {
        httpOnly: true,
        maxAge: 14*24*60*60*1000, // 2 weeks
      });
      /* NOTE: perhaps find a better way than creating a new cookie? */
      res.cookie('uid', result.userID, {
        httpOnly: true,
        maxAge: 14*24*60*60*1000, // 2 weeks
      });
    res.json(result);
  });  
};

exports.logout = function(req, res) {
  var authenticator = new models.Authentication();
  var session = req.cookies.session;
  authenticator.validateCookie(session, function() {
    authenticator.logout(session);
  });
  res.json({});
}

exports.createUser = function(req, res) {
  var authenticator = new models.Authentication();
  var username = req.body.username;
  var name = req.body.name;
  var password = req.body.password;
  var userType = req.body.userType;
  
  authenticator.createUser(username, name, password, userType, function(data) {
    res.json({uid: data.uid});
  });
}

exports.listUsers = function(req, res) {
  var authenticator = new models.Authentication();
  authenticator.listUsers(function(data) {
    res.json(data);
  });
}
