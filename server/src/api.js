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


/* Memos */
function listMemos(request, response) {
  var model = new models.Memo();
  model.list(function(data) {
    server.serveAsJSON(response, data);
  });
}

server.router.get("/api/memos", function(request, response) {
  listMemos(request, response);
});

function getMemo(request, response) {
  var model = new models.Memo();
  model.get({"id": request.params.id}, function(data) {
    server.serveAsJSON(response, data);
  });
}

server.router.get("/api/memos/{id}([0-9]+)", function(request, response) {
  getMemo(request, response);
});

