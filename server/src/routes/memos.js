var models = require('../models');
var util = require("./util");

exports.listMemos = function(req, res) {
  util.checkToken(req, res, function() {
    var memo = new models.Memo();
    memo.list(function(rows) {
      response.json(rows);
    });
  });
}

exports.getMemo = function(req, res) {
  util.checkToken(req, res, function() {
    var memo = new models.Memo();
    memo.get(req.params.id, function(row) {
      res.json(row);
    });
  });
}

exports.createMemo = function(req, res) {
  util.checkToken(req, res, function() {
    var memo = new models.Memo();
    memo.create(req.body, function(result) {
      res.json(result);
    });
  });
}

