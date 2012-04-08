var models = require('../models');
var util = require("./util");

exports.login = function(req, res) {
  var authenticator = new models.Authentication();
  authenticator.login(req.body.username, req.body.password, function(result) {

    if(result.state === 'success') {
      var cookie_params = { httpOnly: true };
      if(req.body.remember_me === 'on')
        cookie_params.maxAge = 14*24*60*60*1000; // 2 weeks

      res.cookie('session', result.token, cookie_params);
      res.cookie('uid', result.userID, cookie_params);
    }

    res.json(result);
  });  
};

exports.logout = function(req, res) {
  var authenticator = new models.Authentication();
  util.checkToken(req, res, function(uid, session) {
    authenticator.logout(session);
  });
  res.json({});
}
