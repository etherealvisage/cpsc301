var models = require('../models');

exports.login = function(req, res) {
  var authenticator = new models.Authentication();
  authenticator.login(req.body.username, req.body.password, function(data){
    res.json(data);
  });  
};
