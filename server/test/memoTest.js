var fixtures = require('../lib/fixtures');
var assert = require('assert');
var testHelpers = require('../lib/test_helpers.js');

describe('Memos', function() {
  beforeEach(function(done) {
    fixtures.load('users', 'sessions', 'memos', done); 
  });
	


  //List all memos
  //	
  describe('Listing', function() {
    it('should return the correct MIME type', function(done) {
      testHelpers.makeGetReq('/api/memos', function(res) {
        assert.equal(res.headers['content-type'], 'application/json; charset=utf-8');
        done();
      });
    });

    it('should list all memos in DB', function(done) {
      testHelpers.makeGetReq('/api/memos', function(res) { 
	//console.log(res);
      }, function(body) {
        var expected = [{ 
          "id": 1,
          "title": "test memo",
          "posterID": 2,
          "postDate": 1333819009,
          "content": "this is a test body",
          "posterName": "Margot",
          "unread": 0 
          },
          {
          "id": 2,
          "title": "another memo",
          "posterID": 3,
          "postDate": 1333911831,
          "content": "Hello program",
          "posterName": "Dr. Banana",
          "unread": 1 
        }];
        var actual = JSON.parse(body);
	//console.log('\n The expected body recieved \n');
	//console.log(expected);
	//console.log('\n And now the actual body recieved \n');
	//console.log(actual);
        assert.deepEqual(expected, actual, 'Memos do not match');
        done();
      });
    });


  });


  //loading single memos
  describe('Single Memos', function() {
    
    it('should list memo 1', function(done) {
      testHelpers.makeGetReq('/api/memos/1', function(res) { 
	//console.log(res);
      }, function(body) {
        var expected = { 
          "id": 1,
          "title": "test memo",
          "posterID": 2,
          "postDate": 1333819009,
          "content": "this is a test body" 
        };
        var actual = JSON.parse(body);
	//console.log('\n The expected body recieved \n');
	//console.log(expected);
	//console.log('\n And now the actual body recieved \n');
	//console.log(actual);
        assert.deepEqual(expected, actual, 'Memos do not match');
        done();
      });
    });



    it('should fail to list the non-existant memo5', function(done) {
      testHelpers.makeGetReq('/api/memos/5', function(res) { 
	//console.log(res);
      }, function(body) {
        var actual = null;
	try{
          console.log("trying"); 
          actual = JSON.parse(body);
	} catch (err) {
	  console.log("exception caught");
	  console.log(err);
	  done();
	}
	
	//console.log('\n The expected body recieved \n');
	//console.log('\n And now the actual body recieved \n');
	//console.log(actual);
       // done();
      });
    });






  });

		/////////////for create with the post request, use the info here https://gist.github.com/7f4ba4fbad8a63a86183


});
