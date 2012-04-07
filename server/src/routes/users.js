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
