var fixtures = require('../lib/fixtures');
var http = require('http');
var assert = require('assert');
var config = require('../src/config');

describe('Discussions', function() {
  beforeEach(function(done) {
    fixtures.load('users', 'sessions', 'discussions', 'posts', done);
  });

  describe('Discussion listing', function() {
    it('should return the correct MIME type', function(done) {
      makeGetReq('/api/discussions', function(res) {
        assert.equal(res.headers['content-type'], 'application/json; charset=utf-8');
        done();
      });
    });

    it('should list a single discussion', function(done) {
      makeGetReq('/api/discussions', function(res) { }, function(body) {
        var expected = [{
          "id": 1,
          "title": "A happy discussion",
          "rootPostID": 1,
          "authorID": 1,
          "postDate": 1333740076,
          "authorName": "Margot & the Nuclear So-Sos",
          "unread": false
        }];
        var actual = JSON.parse(body);
        assert.deepEqual(expected, actual, 'Discussions do not match');
        done();
      });
    });
  });
});

// TODO: unify with equivalent function in staticFileTest.js.
function makeGetReq(path, onResponse, onComplete) {
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
