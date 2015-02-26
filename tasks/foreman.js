var gulp = require('gulp');
var {spawn} = require('child_process');

gulp.task('foreman', function(callback) {
  spawn('nf', ['start', '-j', 'Procfile.dev'], {stdio: 'inherit', env: process.env})
    .on('close', callback);
});