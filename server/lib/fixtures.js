var fs = require('fs');
var path = require('path');
var db = require('../src/models').db;
var config = require('../src/config');

var loadedFixtures = {};
var errReporter = function(err) {
  if(err !== null)
    throw err;
};

var _readFixture = function(fixtureName) {
  var fixtureFilename = path.resolve(config.fixturesPath, fixtureName + '.json');
  var contents = fs.readFileSync(fixtureFilename, 'utf8');
  return JSON.parse(contents);
};

var _insertRows = function(fixture, fixtureName) {
  var tblName = config.dbTablePrefix + fixtureName;
  db.run('DELETE FROM ' + tblName, errReporter);

  loadedFixtures[fixtureName] = {};

  for(var rowName in fixture) {
    var columns = [];
    var placeholders = [];
    var values = [];
    var rowValues = fixture[rowName];

    loadedFixtures[fixtureName][rowName] = rowValues;

    for(var col in rowValues) {
      columns.push(col);
      placeholders.push('?');
      values.push(rowValues[col]);
    }

    var insert = db.prepare('INSERT INTO ' + tblName +
      '(' + columns.join(', ') + ') VALUES (' +
      placeholders.join(', ') + ')'
    );
    insert.run(values, errReporter);
  }
};

exports.load = function() {
  var desiredFixtures = Array.prototype.slice.call(arguments, 0);
  var onDone = desiredFixtures.pop();

  db.serialize(function() {
    // Nest in transaction to potentially enhance DB performance.
    db.run('BEGIN', errReporter);
    desiredFixtures.forEach(function(fixtureName) {
      var fixture = _readFixture(fixtureName);
      _insertRows(fixture, fixtureName);
    });
    db.run('COMMIT', function(err) {
      errReporter(err);
      onDone();
    });
  });
};

exports.fetch = function(fixtureName, rowName) {
  if(fixtureName in loadedFixtures)
    return loadedFixtures[fixtureName][rowName];
  return undefined;
};
