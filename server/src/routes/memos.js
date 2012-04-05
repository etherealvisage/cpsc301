var models = require('../models');
var util = require("./util");

/* TODO: add error checking. */
exports.listMemos = function(req, res) {
  util.checkToken(req, res, function() {
    var memo = new models.Memo();
    memo.list(req.cookies.uid, function(rows) {
      res.json(rows);
    });
  });
}

exports.getMemo = function(req, res) {
  util.checkToken(req, res, function() {
    var memo = new models.Memo();
    req.params.userID = req.cookies.uid;
    memo.get(req.params, function(row) {
      res.json(row);
    });
  });
}

/* TODO: sanitize input. */
exports.createMemo = function(req, res) {
  util.checkTokenAndPermission(req, res, "createMemo", function() {
    var memo = new models.Memo();
    req.body.uid = req.cookies.uid;
    memo.create(req.body, function(result) {
      res.json(result);
    });
  });
}

/* TODO: sanitize input. */
exports.updateMemo = function(req, res) {
  util.checkTokenAndPermission(req, res, "editMemo", function() {
    var memo = new models.Memo();
    memo.update(req.body, function(result) {
      res.json(result);
    });
  });
}
