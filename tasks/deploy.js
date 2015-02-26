var gulp = require('gulp');
var {spawn} = require('child_process');

gulp.task('deploy', function(callback) {
  spawn('bash', ['-c', 'cf target -o xray -s xray && cf push'], {stdio: 'inherit', env: process.env})
    .on('close', callback);
});