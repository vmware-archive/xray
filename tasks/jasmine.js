var express = require('express');
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var {spawn} = require('child_process');

gulp.task('spec', function(callback) {
  runSequence('lint', 'spec-server', 'spec-app', callback);
});

gulp.task('spec-server', function() {
  return gulp.src('spec/server/**/*.js')
    .pipe(plugins.plumber())
    .pipe(plugins.jasmine());
});

gulp.task('spec-app', function(callback) {
  var port = 8888;
  var phantomjs = spawn('phantomjs', ['spec/support/console_reporter.js', port], {stdio: 'inherit', env: process.env});
  phantomjs.on('close', callback);
});

gulp.task('jasmine-assets', function() {
  return gulp.src(['spec/spec.js', 'spec/app/**/*_spec.js'])
    .pipe(plugins.cached('jasmine-javascript'))
    .pipe(plugins.webpack(require('../config/webpack/test')))
    .pipe(gulp.dest('tmp/jasmine'));

});

gulp.task('jasmine-server', function() {
  function createServer(options) {
    var app = express();
    app.use(express.static(__dirname + '/../tmp/jasmine'));
    app.use(express.static(__dirname + '/../spec/app/public'));
    app.listen(options.port, options.ready);
    return app;
  }
  var port = 8888;
  createServer({port});
});

gulp.task('jasmine', ['jasmine-assets', 'jasmine-server']);