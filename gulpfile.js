require('6to5/register');
var glob = require('glob');
glob.sync('tasks/**/*.js').forEach(function(f) {
  require(__dirname + '/' + f);
});