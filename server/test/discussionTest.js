var fixtures = require('../lib/fixtures');
var assert = require('assert');
var testHelpers = require('../lib/test_helpers.js');

describe('Discussions', function() {
  beforeEach(function(done) {
    fixtures.load('users', 'sessions', 'discussions', 'posts', done);
  });

  describe('Listing', function() {
    it('should return the correct MIME type', function(done) {
      testHelpers.makeGetReq('/api/discussions', function(res) {
        assert.equal(res.headers['content-type'], 'application/json; charset=utf-8');
        done();
      });
    });

    it('should list a single discussion with null title', function(done) {
      testHelpers.makeGetReq('/api/discussions', function(res) { 
	//console.log(res);
      }, function(body) {
        var expected = [{
          "id": 1,
          "title": "",
          "rootPostID": 1,
          "authorID": 2,
          "postDate": 1333740076,
          "authorName": "Margot & the Nuclear So-Sos",
          "unread": false
        }];
        var actual = JSON.parse(body);
	console.log('\n The expected body recieved \n');
	console.log(expected);

	console.log('\n And now the actual body recieved \n');
	console.log(actual);
        assert.deepEqual(expected, actual, 'Discussions do not match');
        done();
      });
    });
  });

  describe('Single', function() {
    it('should load one discussion', function(done){ 
      testHelpers.makeGetReq('/api/discussions/1', 
        function(res){
	  //console.log(res)
        }, 
        function(body) {
          var expected = { posts: 
   [ { id: 1,
       posterID: 2,
       postDate: 1333740076,
       body: 'This is my body. There are many like it, but this is mine.',
       discussionID: 1,
       authorName: 'Margot & the Nuclear So-Sos' } ],
  title: '' };
	  var actual = JSON.parse(body);
	  console.log('\n The expected body recieved \n');
	  console.log(expected);

	  console.log('\n And now the actual body recieved \n');
	  console.log(actual);
          assert.deepEqual(expected, actual, 'Discussions do not match');
          done();
	}
      );
    });
  });
});
