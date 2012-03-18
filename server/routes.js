var requestHandlers = require('./requestHandlers');

// If multiple handlers match the current request, only the first will be called.
// Note that all handlers specified will ignore case ('i' parameter) when
// matching requests.
var handlers = [
  {
    path: new RegExp('^/discussions$', 'i'),
    method: 'GET',
    requestHandler: requestHandlers.listDiscussions,
  },
  {
    path: new RegExp('^/$', 'i'),
    method: 'GET',
    requestHandler: requestHandlers.serveRoot
  },
  {
    path: new RegExp('\\.(css|js|ico|png|jpg|jpeg|gif)', 'i'),
    method: 'GET',
    requestHandler: requestHandlers.serveStaticFile
  }
];

exports.handlers = handlers;
