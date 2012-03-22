var util = require('./util');
var requestHandlers = require('./requestHandlers');

// Route the provided response to the appropriate handler. Return a 404 error
// if an appropriate handler is not found.
function route(handlers, request, response, post_data) {
  var reqPath = util.extractPath(request);
  var reqMethod = request.method;

  for(var i = 0; i < handlers.length; i++)
  {
    var handler = handlers[i];

    if(handler.path.test(reqPath) && handler.method === reqMethod) {
      console.log(reqMethod + ' request for ' + reqPath +
        ' dispatched to ' + handler.requestHandler.name);
      handler.requestHandler(response, request, post_data);
      return;
    }
  }

  requestHandlers.throwFileNotFound(response, request);
}

exports.route = route;
