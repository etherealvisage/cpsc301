exports.list_discussions = function(req, res) {
  var discussions = [
    {id: 1, title: 'Pants'},
    {id: 2, title: 'Socks'},
  ];
  res.json(discussions);
};
