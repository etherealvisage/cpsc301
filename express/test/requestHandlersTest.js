var assert = require('assert');
var http = require('http');
var config = require('../config');

describe('Request handlers', function() {
  describe('#serveStaticFile()', function() {
    it('should serve an existing static file with HTTP 200 response code', function(done) {
      make_get_request('/static.test', function(res) {
        var resCode = res.statusCode;
        var expectedCode = 200;
        assert.equal(resCode, expectedCode, 'Got ' + resCode + ' status code instead of expected ' + expectedCode);
        done();
      });
    });

    it('should serve an existing static file with proper contents', function(done) {
      make_get_request('/static.test', function(res) {
        var body = '';
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
          body += chunk;
        });

        res.on('end', function() {
          assert.equal(body, 'Static test.\n', 'Improper body returned');
          done();
        });
      });
    });
  });
});

function make_get_request(path, on_response) {
  http.get({
    host: 'localhost',
    port: config.serverPort,
    path: path,
  }, on_response).on('error', function(err) {
    throw err;
  });
}
