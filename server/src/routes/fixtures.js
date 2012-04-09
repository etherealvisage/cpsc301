var models = require('../models');
var util = require('./util');
var fixtures = require('../../lib/fixtures');

// We had endless problems with "Error: SQLITE_BUSY: database is locked" errors
// resulting from multiple processes (i.e., the server and test suite) writing
// to the database simultaneously. To resolve these, executing "PRAGMA
// journal_mode = WAL" in src/models/index.js helped somewhat, but did not
// fully resolve the issues. As such, we allow the testing user to load
// fixtures remotely (though, for security reasons, this functionailty is
// activated only in the testing environment).
exports.loadFixtures = function(req, res) {
  fixtures.load(req.body, function() {
    res.json(fixtures.loaded);
  });
};
