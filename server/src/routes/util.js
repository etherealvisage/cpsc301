var models = require("../models");

exports.checkToken = function(req, res, onValid) {
  var auth = new models.Authentication();
  auth.validateCookie(req.cookies.session, onValid, function() {
    exports.returnError(res, "auth");
  });
}

function returnError(res, error) {
  res.json({error: error});
}
exports.returnError = returnError;

