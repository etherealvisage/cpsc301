var models = require("../models");

exports.checkToken = function(req, res, onValid) {
  var auth = new models.Authentication();
  auth.validateCookie(req.cookies.session, req.cookies.uid, onValid, function() {
    exports.returnError(res, "auth");
  });
}

exports.checkPermission = function(req, res, action, onValid, context) {
  var perm = new models.Permissions();
  perm.check(req.cookies.uid, action, function(result) {
    if(result)
      onValid();
    else
      exports.returnError(res, "perm");
  }, context);
}

exports.checkTokenAndPermission = function(req, res, action, onValid, context) {
  this.checkToken(req, res, function() {
    this.checkPermission(req, res, action, onValid, context);
  });  
}

function returnError(res, error) {
  res.json({error: error});
}
exports.returnError = returnError;

