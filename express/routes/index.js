var path = require('path');

exports.index = function(req, res) {
  res.sendfile(path.join(req.app.settings.staticPath, 'index.html'));
};

['discussions'].forEach(function(moduleName) {
  var module = require('./' + moduleName);
  for(var ex in module)
    exports[ex] = module[ex];
});
