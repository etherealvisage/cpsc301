var assert = require('assert');
var http = require('http');
var config = require('../src/config');
var fixtures = require('../lib/fixtures');
var testHelpers = require('../lib/test_helpers');

describe('Static file server', function() {
  it('should serve an existing static file with HTTP 200 response code', function(done) {
    testHelpers.makeGetReq('/static.test', function(res) {
      var resCode = res.statusCode;
      var expectedCode = 200;
      assert.equal(resCode, expectedCode,
        'Got ' + resCode + ' status code instead of expected ' + expectedCode);
      done();
    });
  });

  it('should serve an existing static file with proper contents', function(done) {
    testHelpers.makeGetReq('/static.test', function(res) { }, function(body) {
      assert.equal(body, 'Static test.\n', 'Improper body returned');
      done();
    });
  });

  it('should return an HTTP 404 error for a non-existent file', function(done) {
    testHelpers.makeGetReq('/does_not_exist', function(res) {
      var resCode = res.statusCode;
      var expectedCode = 404;
      assert.equal(resCode, expectedCode);
      done();
    });
  });
});
