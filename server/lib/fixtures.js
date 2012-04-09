var fs = require('fs');
var path = require('path');
var db = require('../src/models').db;
var config = require('../src/config');

var loadedFixtures = {};
exports.loaded = loadedFixtures;

var errReporter = function(err) {
  if(err !== null)
    throw err;
};

function FixtureDoesNotExistError(name) {
  this.name = 'FixtureDoesNotExistError';
  this.message = 'Fixture ' + name + ' does not exist.';
};
FixtureDoesNotExistError.prototype = new Error();
FixtureDoesNotExistError.prototype.constructor = FixtureDoesNotExistError;

exports.readFixture = function(fixtureName) {
  // config.fixturesPath is relative to config.js, which is in ../src.
  var fixturesDir = path.resolve(__dirname, '..', 'src', config.fixturesPath);
  var fixturePath = path.resolve(path.join(fixturesDir, fixtureName + '.json'));
  if(
      fixturePath.indexOf(fixturesDir) !== 0 ||
      !path.existsSync(fixturePath)
    )
    throw new FixtureDoesNotExistError(fixtureName);

  var contents = fs.readFileSync(fixturePath, 'utf8');
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

exports.load = function(fixtureNames, onDone) {
  db.serialize(function() {
    // Nest in transaction to potentially enhance DB performance.
    db.run('BEGIN', errReporter);
    fixtureNames.forEach(function(fixtureName) {
      try {
        var fixture = exports.readFixture(fixtureName);
      } catch(e) {
        if(!(e instanceof FixtureDoesNotExistError))
          throw e;
        console.log(e.message);
        return;
      }
      _insertRows(fixture, fixtureName);
    });
    db.run('COMMIT', function(err) {
      errReporter(err);
      onDone();
    });
  });
};
