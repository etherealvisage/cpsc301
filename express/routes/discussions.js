exports.listDiscussions = function(req, res) {
  var discussions = [
    {id: 1, title: 'Pants'},
    {id: 2, title: 'Socks'},
  ];
  res.json(discussions);
};

exports.createDiscussion = function(req, res) {
  res.send(req.body);
};
