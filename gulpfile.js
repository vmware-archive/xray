require('6to5/register');
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var glob = require('glob');
glob.sync('tasks/**/*.js').forEach(function(f) {
  require(__dirname + '/' + f);
});