var assert = require('assert');
var testHelpers = require('../lib/test_helpers.js');

describe('Memos', function() {
  var fixtureData = null;
  beforeEach(function(done) {
    testHelpers.loadFixturesRemotely(['users', 'sessions', 'memos'], function(fixData) {
      fixtureData = fixData;
      done();
    });
  });
	
  //List all memos
  describe('Listing', function() {
    it('should return the correct MIME type', function(done) {
      testHelpers.makeGetReq('/api/memos', function(res) {
        assert.equal(res.headers['content-type'], 'application/json; charset=utf-8');
        done();
      });
    });

    it('should list all memos in DB', function(done) {
      testHelpers.makeGetReq('/api/memos', function(res) { 
      }, function(body) {
        var expected = [{
          "id": 1,
          "title": "Ooh, a title!",
          "posterID": 1,
          "postDate": 1333820201,
          "content": "I am a memo.",
          "posterName": "mike",
          "unread": 0
        }];
        var actual = JSON.parse(body);
        assert.deepEqual(expected, actual);
        done();
      });
    });
  });


  describe('Single Memos', function() {
    it('should list memo 1', function(done) {
      testHelpers.makeGetReq('/api/memos/1', function(res) {
      }, function(body) {
        var expected = {
          "id": 1,
          "title": "Ooh, a title!",
          "posterID": 1,
          "postDate": 1333820201,
          "content": "I am a memo."
        };

        var actual = JSON.parse(body);
        assert.deepEqual(expected, actual);
        done();
      });
    });

    it('should fail to list the non-existent memo', function(done) {
      testHelpers.makeGetReq('/api/memos/999999', function(res) {
        assert.equal(res.statusCode, 204);
      }, function(body) {
        assert.equal(body, '');
        done();
      });
    });
  });


  describe('\nMemo Creation', function() {
    it('should successfully create a new memo', function(done) {
      var title = 'LOL this is a title';
      var content = 'And this is the corresponding body.';
        testHelpers.makePostReq('/api/memos', {
          title: title,
          content: content
        }, function(res) {
          assert.equal(res.statusCode, 200);
        }, function(body) {
          body = JSON.parse(body);
          testHelpers.makeGetReq('/api/memos/' + body.memoID, function(res) {
            assert.equal(res.statusCode, 200);
          }, function(body) {
            var actual = JSON.parse(body);
            var expected = {
              "id": 2,
              "title": "LOL this is a title",
              "posterID": 2,
              "content": "And this is the corresponding body."
            };
            // Ignore post date, since we don't know exactly what timestamp of post will be.
            delete actual.postDate;
            assert.deepEqual(actual, expected, "Memos aren't equal");
            done();
          });
      });    
    });

    it('should successfully create a new memo with an empty body', function(done) {
      var title = 'Look I made a memo';
      var content = '';
        testHelpers.makePostReq('/api/memos', {
          title: title,
          content: content
        }, function(res) {
          assert.equal(res.statusCode, 200);
        }, function(body) {
          body = JSON.parse(body);
          testHelpers.makeGetReq('/api/memos/' + body.memoID, function(res) {
            assert.equal(res.statusCode, 200);
          }, function(body) {
            var actual = JSON.parse(body);
            var expected = {
              "id": 2,
              "title": "Look I made a memo",
              "posterID": 2,
              "content": ""
            };
            // Ignore post date, since we don't know exactly what timestamp of post will be.
            delete actual.postDate;
	   // console.log(expected);
	   // console.log(actual);
            assert.deepEqual(actual, expected, "Memos aren't equal");
            done();
          });
      });    
    });


    it('should fail to create a memo with an empty title', function(done) {
      var title = '';
      var content = 'Look I made a bad memo';
        testHelpers.makePostReq('/api/memos', {
          title: title,
          content: content
        }, function(res) {
          assert.equal(res.statusCode, 500, 'Error code should return 500 for fail, returned ' + res.statusCode);
        }, function(body) {
          done();
      });    
    });

  });






		/////////////for create with the post request, use the info here https://gist.github.com/7f4ba4fbad8a63a86183
});
