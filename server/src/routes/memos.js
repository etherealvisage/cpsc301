var models = require('../models');
var util = require("./util");

exports.listMemos = function(req, res) {
  util.checkToken(req, res, function() {
    var memo = new models.Memo();
    memo.list(function(rows) {
      res.json(rows);
    });
  });
}

exports.getMemo = function(req, res) {
  util.checkToken(req, res, function() {
    var memo = new models.Memo();
    memo.get(req.params, function(row) {
      res.json(row);
    });
  });
}

/* TODO: check permissions & sanitize input. */
exports.createMemo = function(req, res) {
  util.checkToken(req, res, function() {
    var memo = new models.Memo();
    memo.create(req.body, function(result) {
      res.json(result);
    });
  });
}

/* TODO: check permissions & sanitize input. */
exports.updateMemo = function(req, res) {
  util.checkToken(req, res, function() {
    var memo = new models.Memo();
    memo.update(req.body, function(result) {
      res.json(result);
    });
  });
}
