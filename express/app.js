var express = require('express')
  , path = require('path')
  , config = require('./config')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');

  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  // Max static document age: 6 h
  app.use(express.static(config.staticDocPath, { maxAge: config.staticDocMaxAge }));
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
