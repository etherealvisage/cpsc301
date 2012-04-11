var assert = require('assert');
var testHelpers = require('../lib/test_helpers.js');
var fs = require('fs');

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
        assert.equal(res.statusCode, 200);
      }, function(body) {
        var actual = JSON.parse(body);
        var expected = { error: 'request' };
        assert.deepEqual(actual, expected, 'Improper error returned');
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
        testHelpers.makePostReq('/api/memos', {
          title: '',
          content: 'Look, I made a bad memo!'
        }, function(res) {
          assert.equal(res.statusCode, 200, 'HTTP status code ' + res.statusCode + ' returned instead of 200');
        }, function(body) {
          var expected = { error: 'request' };
          var actual = JSON.parse(body);
          assert.deepEqual(actual, expected, 'Improper error returned');
          done();
      });    
    });

    it('should fail to create a memo with an empty body', function(done) {
        testHelpers.makePostReq('/api/memos', {
          title: 'Le title',
          content: ''
        }, function(res) {
          assert.equal(res.statusCode, 200, 'HTTP status code ' + res.statusCode + ' returned instead of 200');
        }, function(body) {
          var expected = { error: 'request' };
          var actual = JSON.parse(body);
          assert.deepEqual(actual, expected, 'Improper error returned');
          done();
      });    
    });

    it('should fail to create a memo with a lot of Lorem Ipsum for the body', function(done) {
      var title = 'alice';
      var content = '';
      fs.readFile('../server/test/alice.txt', function(err,data){
	if(err) {
	  console.error("Could not open file: %s", err);
	  assert.equal(1,2,"File open fail")
	  }
	  content = data;
      });
      testHelpers.makePostReq('/api/memos', {
          title: title,
          content: content
        }, function(res) {
	//  console.log(res.statusCode);
          assert.equal(res.statusCode, 500, 'Error code should return 500 for fail, returned ' + res.statusCode);
        }, function(body) {
          done();
      });    
    });

    it('should fail to create a memo with a lot of Lorem Ipsum for the title', function(done) {
      var title = '';
      var content = 'a body';
      fs.readFile('../server/test/alice.txt', function(err,data){
	if(err) {
	  console.error("Could not open file: %s", err);
	  assert.equal(1,2,"File open fail")
	  }
	  title = data;
      });
      testHelpers.makePostReq('/api/memos', {
          title: title,
          content: content
        }, function(res) {
	//  console.log(res.statusCode);
          assert.equal(res.statusCode, 500, 'Error code should return 500 for fail, returned ' + res.statusCode);
        }, function(body) {
          done();
      });    
    });

  });






		/////////////for create with the post request, use the info here https://gist.github.com/7f4ba4fbad8a63a86183
});
