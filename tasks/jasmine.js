var express = require('express');
var gulp = require('gulp');
var gutil = require('gulp-util');
var plugins = require('gulp-load-plugins')();
var mime = require('mime');
var path = require('path');
var runSequence = require('run-sequence');
var through2 = require('through2');
var url = require('url');

gulp.task('spec', function(callback) {
  runSequence('lint', 'spec-server', callback);
});

gulp.task('spec-server', function() {
  return gulp.src('spec/server/**/*.js')
    .pipe(plugins.plumber())
    .pipe(plugins.jasmine());
});

function createServer(options = {}) {
  var app = express();
  app.use(express.static(__dirname + '/../spec/app/public'));

  app.use(function(req, res) {
    var file, filename = path.basename(url.parse(req.path).path);
    if ((file = files[filename])) {
      res.status(200).type(mime.lookup(filename)).send(file);
      return;
    }

    res.status(404).type('html').send('File not found!');
  });

  var files = {};
  gulp.src('spec/app/**/*_spec.js')
    .pipe(plugins.plumber())
    .pipe(plugins.webpack(require('../config/webpack/test')))
    .pipe(through2.obj(function(file, enc, callback) {
      files[path.basename(file.path)] = file.contents;
      this.push(file);
      callback();
    }));

  app.listen(options.port, options.ready);
}

gulp.task('jasmine', function() {
  var port = 8888;
  createServer({port: port, ready: function() {
    gutil.log(`Jasmine listening on port ${port}`);
  }});
});