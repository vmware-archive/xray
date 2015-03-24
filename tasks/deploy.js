var gulp = require('gulp');
var runSequence = require('run-sequence');
var {spawn} = require('child_process');

gulp.task('cf-push', function(callback) {
  spawn('bash', ['-c', 'cf target -o xray -s xray && cf push'], {stdio: 'inherit', env: process.env})
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