var server = require('./server');
var router = require('./router');
var routes = require('./routes');

// Basic request flow is as follows:
//   1. HTTP request received by server.js.
//   2. Request dispatched to router.route().
//   3. Any handler specified below whose path and method
//      match the request's is called.

server.start(router.route, routes.handlers);
