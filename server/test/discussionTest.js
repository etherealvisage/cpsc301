var fixtures = require('../lib/fixtures');
var assert = require('assert');
var testHelpers = require('../lib/test_helpers.js');

describe('Discussions', function() {
  var fixtureData = null;
  beforeEach(function(done) {
    testHelpers.loadFixturesRemotely(['users', 'sessions', 'discussions', 'posts'], function(fixData) {
      fixtureData = fixData;
      done();
    });
  });

  describe('Listing', function() {
    it('should return the correct MIME type', function(done) {
      testHelpers.makeGetReq('/api/discussions', function(res) {
        assert.equal(res.headers['content-type'], 'application/json; charset=utf-8');
        done();
      });
    });

    it('should list all discussions', function(done) {
      testHelpers.makeGetReq('/api/discussions', function(res) { 
      }, function(body) {
        var expected = [
          {
            id: 1,
            title: 'title',
            rootPostID: 1,
            authorID: 2,
            postDate: 1333740076,
            authorName: 'Margot',
            unread: false
          },
          {
            id: 2,
            title: 'post',
            rootPostID: 2,
            authorID: 2,
            postDate: 1333740079,
            authorName: 'Margot',
            unread: false
          }
        ];

        var actual = JSON.parse(body);
        assert.deepEqual(actual, expected);
        done();
      });
    });
  });

  describe('Single', function() {
    it('should load one discussion', function(done){ 
      testHelpers.makeGetReq('/api/discussions/2', function(res){
      }, function(body) {
        var expected = {
          title: 'post',
          posts: [{
            id: 2,
            posterID: 2,
            postDate: 1333740079,
            body: 'This is my body.',
            discussionID: 2,
            authorName: 'Margot'
          }]
        };

        var actual = JSON.parse(body);
        assert.deepEqual(actual, expected, 'Discussions do not match');
        done();
      }
      );
    });
  });
});
