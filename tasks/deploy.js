var gulp = require('gulp');
var runSequence = require('run-sequence');
var {spawn} = require('child_process');

const COMMANDS = {
  ketchup: `cf api --skip-ssl-validation api.ketchup.cf-app.com
            cf login -o xray -s xray -u $(awk -F= '/KETCHUP_USERNAME/ {print $2}' .env) -p $(awk -F= '/KETCHUP_PASSWORD/ {print $2}' .env)
            cf push`,
  pws: `cf api api.run.pivotal.io
        cf login -o pivotal -s pivotal-ui
        cf push`,
  staging: `cf api api.run.pivotal.io
            cf login -o pivotal -s pivotal-ui
            cf push -f manifest-staging.yml`
};

gulp.task('cf-push', function(callback) {
  var command = COMMANDS[process.env.ENV];
  if (!command) {
    return callback('Please set ENV to ketchup, pws, or staging');
  }
  spawn('bash', ['-c', command], {stdio: 'inherit', env: process.env})
    .on('close', callback);
});

gulp.task('deploy', function(callback) {
  var env = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  runSequence('assets', 'cf-push', function() {
    process.env.NODE_ENV = env;
    callback();
  });
});