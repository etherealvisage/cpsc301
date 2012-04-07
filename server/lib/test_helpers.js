var fixtures = require('../lib/fixtures');
var http = require('http');
var config = require('../src/config');

exports.makeGetReq = function(path, onResponse, onComplete) {
  var session = fixtures.fetch('sessions', 'margot');

  http.get({
    host: 'localhost',
    port: config.serverPort,
    path: path,
    headers: {
      // This does not properly encode the cookie's values, but for our use,
      // where we don't expect to get any values tht aren't alphanumeric, it is
      // sufficient.
      'Cookie': [
        'uid=' + session.userID,
        'session=' + session.token
      ].join('; ')
    }
  }, function(res) {
    if(typeof onResponse !== 'undefined')
      onResponse(res);

    res.setEncoding('utf8');

    var body = '';
    res.on('data', function(chunk) {
      body += chunk;
    });
    res.on('end', function() {
      if(typeof onComplete !== 'undefined')
        onComplete(body);
    });
  }).on('error', function(err) {
    throw err;
  });
}
