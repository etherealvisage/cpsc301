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
    console.log("id: " + req.params.id);
    memo.get(req.params, function(row) {
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

