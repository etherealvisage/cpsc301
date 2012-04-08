var models = require('../models');
var util = require("./util");

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
  util.checkToken(req, res, function(uid, session) {
    authenticator.logout(session);
  });
  res.json({});
}
