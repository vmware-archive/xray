require('6to5/register')({experimental: true});

var app = require('./app');
app.listen(process.env.PORT || 3000, function() {
  process.send && process.send({cmd: 'ready'});
});
module.exports = app;