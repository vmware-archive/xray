var express = require('express');
var gulp = require('gulp');
var gutil = require('gulp-util');
var plugins = require('gulp-load-plugins')();
var mime = require('mime');
var path = require('path');
var runSequence = require('run-sequence');
var through2 = require('through2');
var url = require('url');
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

function jasmineServer(options = {}) {
  var app;
  var files = {};

  function createServer(options) {
    var app = express();
    app.use(express.static(__dirname + '/../spec/app/public'));

    app.use(function(req, res) {
      var filename = path.basename(url.parse(req.path).path);
      var file = files[filename];
      if (file) {
        res.status(200).type(mime.lookup(filename)).send(file);
        return;
      }

      res.status(404).type('html').send('File not found!');
    });
    app.listen(options.port, options.ready);
    return app;
  }

  return through2.obj(function(file, enc, callback) {
    files[path.basename(file.path)] = file.contents;
    this.push(file);
    if (!app) app = createServer(options);
    callback();
  });
}

gulp.task('jasmine', function() {
  var port = 8888;

  gulp.src('spec/app/**/*_spec.js')
    .pipe(plugins.plumber())
    .pipe(plugins.webpack(require('../config/webpack/test')))
    .pipe(jasmineServer({port, ready: () => gutil.log(`Jasmine listening on port ${port}`)}));
});