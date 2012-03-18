function listDiscussions(response, request) {
  var discussions = [
    {
      title: 'Under Your Spell',
      author: 'Desire',
    },
    {
      title: 'A Real Hero',
      author: 'College',
    }
  ];

  var response_body = JSON.stringify(discussions);

  response.writeHead(200, {'Content-Type': 'application/json'});
  response.write(response_body);
  response.end();
}

exports.listDiscussions = listDiscussions;
