var express = require('express')
  , path = require('path')
  , config = require('./config')
  , routes = require('./routes');

var app = module.exports = express.createServer();


/*=============
  Configuration
  =============*/
app.configure(function(){
  app.use(express.cookieParser());
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


/*======
  Routes
  ======*/
app.get('/', routes.index);

app.post('/api/authenticate', routes.login);
app.post('/api/logout', routes.logout);
app.post('/api/users', routes.createUser);

app.get('/api/memos', routes.listMemos);
app.get('/api/memos/:id([0-9]+)', routes.getMemo);
app.put('/api/memos/:id([0-9]+)', routes.updateMemo);
app.post('/api/memos', routes.createMemo);

app.get('/api/discussions', routes.listDiscussions);
app.get('/api/discussions/:id([0-9]+)', routes.getDiscussion);
app.post('/api/discussions', routes.createDiscussion);

app.post('/api/posts', routes.createPost);


/*=====================
  Server initialization
  =====================*/
app.listen(config.serverPort);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
