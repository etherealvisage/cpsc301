var models = require('../models');

exports.listDiscussions = function(req, res) {
  var discussion = new models.Discussion();
  discussion.list(function(rows) {
    res.json(rows);
  });
};

exports.createDiscussion = function(req, res) {
  var discussion = new models.Discussion();
  discussion.create(req.body);
  res.end();
};
