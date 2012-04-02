var models = require('../models');

exports.listDiscussions = function(req, res) {
  util.checkToken(req, res, function() {  
    var discussion = new models.DiscussionRegistry();
    discussion.list(function(rows) {
      res.json(rows);
    });
  });
};

exports.createDiscussion = function(req, res) {
  util.checkToken(req, res, function() {    
    var discussion = new models.DiscussionRegistry();
    discussion.create(req.body);
    res.end();
  });
};

exports.getDiscussion = function(req, res) {
  util.checkToken(req, res, function() {  
    var discussion_id = parseInt(req.params.id, 10);
    var discussion = new models.Discussion;
    discussion.load(discussion_id, function(result) {
      res.json(result);
    });
  });
};
