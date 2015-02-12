require('node-jsx').install({harmony: true});
require('6to5/register')({
  ignore: /(?:node_modules|vendor)/
});

var app = require('./app');
app.listen(process.env.PORT || 3000, function() {
  process.send && process.send({cmd: 'ready'});
});
module.exports = app;