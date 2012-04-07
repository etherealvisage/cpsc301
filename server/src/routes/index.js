var path = require('path');
var config = require('../config');

exports.index = function(req, res) {
  res.sendfile(path.join(config.staticDocPath, 'index.html'));
};

exports.redirectToIndex = function(req, res) {
  var url = req.url.substring(1); // Strip leading '/' for Backbone's consumption.
  // Use two '#' characters rather than one, as with only one, Backbone will
  // intercept and route the URL. (E.g., if you go to '/#memos', Backbone will
  // intercept this and load the route associated with "memos", just as if you
  // went to "/memos" in a pushState-enabled browser.) By using two '##'
  // characters, Backbone strips one, meaning that going to "##memos" will try
  // to route "#memos", which, because of the remaining "#", will load the
  // route associated with "" (i.e., the empty path). This will load the index
  // route, allowing it to properly modify the navbar state and other global UI
  // elements, before manually routing the user based on window.location.hash.
  res.writeHead(303, { 'Location': '/##' + url });
  res.end();
};

['discussions', 'memos', 'authenticate', 'posts', 'users'].forEach(function(moduleName) {
  var module = require('./' + moduleName);
  for(var ex in module)
    exports[ex] = module[ex];
});
