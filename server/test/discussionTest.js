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

    it('should return an error object when accessing a non-existent discussion', function(done) {
      testHelpers.makeGetReq('/api/discussions/99999', function(res) {
        assert.equal(res.statusCode, 200);
      }, function(body) {
        var expected = { error: 'request' };
        var actual = JSON.parse(body);
        assert.deepEqual(actual, expected, 'Improper error returned');
        done();
      });
    });

    it('should return an HTTP 404 error when accessing a non-numeric discussion ID', function(done) {
      testHelpers.makeGetReq('/api/discussions/non-numeric', function(res) {
        assert.equal(res.statusCode, 404);
      }, function(body) {
        done();
      });
    });
  });
  
  describe('Discussion creation', function() {
    it('should succesfully create a discussion given valid title and body', function(done) {
      var title = 'LOL this is a title';
      var content = 'And this is the corresponding body.';

      testHelpers.makePostReq('/api/discussions', {
        title: title,
        content: content
      }, function(res) {
        assert.equal(res.statusCode, 200);
      }, function(body) {
        body = JSON.parse(body);
        testHelpers.makeGetReq('/api/discussions/' + body.discussionID, function(res) {
          assert.equal(res.statusCode, 200);
        }, function(body) {
          var actual = JSON.parse(body);
          var expected = {
            "title":"LOL this is a title",
            "posts":[{
              "id":3,
              "posterID":2,
              "body":"And this is the corresponding body.",
              "discussionID":3,
              "authorName":"Margot"
            }]
          };
          // Ignore post date, since we don't know exactly what timestamp of post will be.
          delete actual.posts[0].postDate;
          assert.deepEqual(actual, expected, "Discussions aren't equal");
          done();
        });
      });
    });
  });
});
