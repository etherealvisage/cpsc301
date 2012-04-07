var fixtures = require('../lib/fixtures');
var assert = require('assert');
var testHelpers = require('../lib/test_helpers.js');

describe('Discussions', function() {
  beforeEach(function(done) {
    fixtures.load('users', 'sessions', 'discussions', 'posts', done);
  });

  describe('Discussion listing', function() {
    it('should return the correct MIME type', function(done) {
      testHelpers.makeGetReq('/api/discussions', function(res) {
        assert.equal(res.headers['content-type'], 'application/json; charset=utf-8');
        done();
      });
    });

    it('should list a single discussion', function(done) {
      testHelpers.makeGetReq('/api/discussions', function(res) { }, function(body) {
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
