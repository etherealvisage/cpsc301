var fixtures = require('../lib/fixtures');
var http = require('http');
var config = require('../src/config');
var querystring = require('querystring');

function _prepareReqParams(path) {
  // Margot's session is hard-coded. This is somewhat of a hack -- perhaps
  // improve in future.
  var session = fixtures.readFixture('sessions').margot;
  var params = {
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
  };
  return params;
}

function _handleResponse(onResponse, onComplete) {
  return (function(res) {
    if(typeof onResponse !== 'undefined')
      onResponse(res);

    var body = '';
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      body += chunk;
    });
    res.on('end', function() {
      if(typeof onComplete !== 'undefined')
        onComplete(body);
    });
  });
}

exports.makeGetReq = function(path, onResponse, onComplete) {
  var request = http.get(_prepareReqParams(path),
    _handleResponse(onResponse, onComplete));
  request.on('error', function(err) {
    throw err;
  });
}

exports.makePostReq = function(path, data, onResponse, onComplete) {
  var params = _prepareReqParams(path);
  params.method = 'POST';
  params.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';

  var request = http.request(params, _handleResponse(onResponse, onComplete));
  var encoded = querystring.stringify(data);
  request.end(encoded, 'utf8');
  request.on('error', function(err) {
    throw err;
  });
};

exports.makePutReq = function(path, data, onResponse, onComplete) {
  var params = _prepareReqParams(path);
  params.method = 'PUT';
  params.headers['Content-Type'] = 'application/json';

  var request = http.request(params, _handleResponse(onResponse, onComplete));
  var encoded = JSON.stringify(data);
  request.end(encoded, 'utf8');
  request.on('error', function(err) {
    throw err;
  });
};

exports.loadFixturesRemotely = function(fixtureNames, onDone) {
  var params = {
    host: 'localhost',
    port: config.serverPort,
    path: '/api/fixtures',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  };

  var request = http.request(params, _handleResponse(function(res) { }, function(body) {
    onDone(JSON.parse(body));
  }));
  var encoded = JSON.stringify(fixtureNames);
  request.end(encoded, 'utf8');
  request.on('error', function(err) {
    throw err;
  });
};
