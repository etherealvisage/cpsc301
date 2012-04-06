var models = require('../models');
var util = require('./util');

exports.listDiscussions = function(req, res) {
  util.checkToken(req, res, function() {  
    var discussion = new models.Discussion();
    discussion.list(req.cookies.uid, function(rows) {
      res.json(rows);
    });
  });
};

exports.createDiscussion = function(req, res) {
  util.checkToken(req, res, function() {    
    var discussion = new models.Discussion();
    req.body.uid = req.cookies.uid;
    discussion.createDiscussion(req.body, function(result) {
      res.json(result);
    });
  });
};

exports.getDiscussion = function(req, res) {
  util.checkToken(req, res, function() {  
    var discussionID = parseInt(req.params.id, 10);
    var discussion = new models.Discussion;
    discussion.getDiscussion(discussionID, function(result) {
      res.json(result);
    });
  });
};
