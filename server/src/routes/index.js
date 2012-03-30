var path = require('path');
var config = require('../config');

exports.index = function(req, res) {
  res.sendfile(path.join(config.staticDocPath, 'index.html'));
};

['discussions', 'memos', 'authenticate', 'posts'].forEach(function(moduleName) {
  var module = require('./' + moduleName);
  for(var ex in module)
    exports[ex] = module[ex];
});
