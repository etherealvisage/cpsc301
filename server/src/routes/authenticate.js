var models = require('../models');

exports.login = function(req, res) {
  var authenticator = new models.Authentication();
  authenticator.login(req.body.username, req.body.password, function(result) {
    if(result.state === 'success')
      res.cookie('session', result.token, {
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
  }};
