var express = require('express')
  , path = require('path')
  , config = require('./config')
  , routes = require('./routes');
var app = module.exports = express.createServer();
var webClientRoutes = require('../../webclient/js/router');

/*=============
  Configuration
  =============*/
app.configure(function() {
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  // Max static document age: 6 h
  app.use(express.static(config.staticDocPath, { maxAge: config.staticDocMaxAge }));
});

app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});


/*======
  Routes
  ======*/
app.post('/api/authenticate', routes.login);
app.post('/api/logout', routes.logout);

app.get('/api/users/current', routes.getUser);
app.get('/api/users', routes.listUsers);
app.post('/api/users', routes.createUser);

app.get('/api/memos', routes.listMemos);
app.get('/api/memos/:id([0-9]+)', routes.getMemo);
app.put('/api/memos/:id([0-9]+)', routes.updateMemo);
app.post('/api/memos', routes.createMemo);

app.get('/api/discussions', routes.listDiscussions);
app.get('/api/discussions/:id([0-9]+)', routes.getDiscussion);
app.post('/api/discussions/:id([0-9]+)', routes.addDiscussionPost);
app.post('/api/discussions', routes.createDiscussion);

// Only permit fixtures to be loaded remotely when NODE_ENV=test environment
// variable is set.
app.configure('test', function() {
  app.post('/api/fixtures', routes.loadFixtures);
});

// This route isn't strictly necessary, as Express' static-file-handling code
// seems to automaticaly serve a static file named index.html if no "root"
// route is provided. Nevertheless, I feel more comfortable making this
// behaviour explicit.
app.get('/', routes.index);

// If user tries to navigate to URL that is valid for Backbone client, redirect
// him to the index so that Backbone may take over.
for(var clientRoute in webClientRoutes.routeMap) {
  // Ignore the "root" route, which we handle above.
  if(clientRoute === '')
    continue;

  app.get('/' + clientRoute, routes.redirectToIndex);
}

/*=====================
  Server initialization
  =====================*/
app.listen(config.serverPort);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
