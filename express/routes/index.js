var path = require('path');

exports.index = function(req, res) {
  res.sendfile(path.join(req.app.settings.static_path, 'index.html'));
};
