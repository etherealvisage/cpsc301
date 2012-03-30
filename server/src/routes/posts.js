var models = require('../models');

exports.createPost = function(req, res) {
  var post = new models.Post();
  post.create(req.body);
  res.end();
};
