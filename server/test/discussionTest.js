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

    it('should list a two discussions', function(done) {
      testHelpers.makeGetReq('/api/discussions', function(res) { 
	//console.log(res);
      }, function(body) {
        var expected = [{
          "id": 1,
          "title": 'title',
          "rootPostID": 1,
          "authorID": 2,
          "postDate": 1333740076,
          "authorName": "Margot & the Nuclear So-Sos",
          "unread": false
        },{
          "id": 2,
          "title": "post",
          "rootPostId": 2,
          "authorId": 2,
	  "postDate": 1333740079,
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
      testHelpers.makeGetReq('/api/discussions/2', 
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
             title: 'title' };
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
  
  describe('Create Discussion', function() {
     it('should succesfully create a discussion', function(done){ 
         testHelpers.makePostReq('/api/discussions', {
         title: 'LOL this is a title',
         content: 'And this is the corresponding body.'
       }, function(res) {
           console.log(res.statusCode);
           assert.equal(res.statusCode,200);
       }, function(body) {
           console.log(" THIS IS THE BODY", body);         
           done();
     });
  	 });
    });
});


  

