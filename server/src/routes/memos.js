var models = require('../models');

exports.listMemos = function(req, res) {
  var memo = new models.Memo();
  memo.list(function(rows) {
    res.json(rows);
  });
}

exports.getMemo = function(req, res) {
  var memo = new models.Memo();
  memo.get(req.params.id, function(row) {
    res.json(row);
  });
}

exports.createMemo = function(req, res) {
  var memo = new models.Memo();
  memo.create(req.body, function(result) {
    res.json(result);
  });
};

