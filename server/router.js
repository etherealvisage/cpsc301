var util = require('./util');

// Route the provided response to the appropriate handler. Return a 404 error
// if an appropriate handler is not found.
function route(handlers, request, response) {
  var reqPath = util.extractPath(request);
  var reqMethod = request.method;

  for(var i = 0; i < handlers.length; i++)
  {
    var handler = handlers[i];

    if(handler.path.test(reqPath) && handler.method === reqMethod) {
      console.log(reqMethod + ' request for ' + reqPath +
        ' dispatched to ' + handler.requestHandler.name);
      handler.requestHandler(response, request);
      return;
    }
  }

  console.log('No ' + reqMethod + ' handler found for ' + reqPath);
  response.writeHead(404, {'Content-Type': 'text/plain'});
  response.write('404 Not Found');
  response.end();
}

exports.route = route;
