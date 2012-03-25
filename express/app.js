
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , path = require('path');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('staticPath', path.join(__dirname, '..', 'webclient'));
  app.set('dbFile', path.join(__dirname, '..', 'server', 'misc', 'database.sqlite'));

  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  // Max static document age: 6 h
  app.use(express.static(app.settings.staticPath, { maxAge: 6*60*60*1000 }));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/discussions', routes.listDiscussions);
app.post('/discussions', routes.createDiscussion);

app.listen(8888);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
