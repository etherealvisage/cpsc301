var server = require("./server");
var models = require("./models");

function createToken(request, response, decoded) {
  var model = new models.Authentication();
  model.create(decoded, function(data) {
    server.serveAsJSON(response, data);
  });
}

server.router.post("/api/auth", function(request, response) {
  server.getPOST(request, function(request, decoded) {
    createToken(request, response, decoded);
  });
});

server.router.get("/{base}", function(req, res) {
  console.log(JSON.stringify(req.params));
});

