var express = require('express');
var gulp = require('gulp');
var lsof = require('lsof');
var plugins = require('gulp-load-plugins')();
var portfinder = require('portfinder');
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

function jasmineConsoleReporter(port, callback) {
  var phantomjs = spawn('phantomjs', ['spec/support/console_reporter.js', port], {stdio: 'inherit', env: process.env});
  phantomjs.on('close', callback);
}

gulp.task('spec-app', function(callback) {
  var port = 8888;
  lsof.rawTcpPort(port, function(data) {
    if (data.length) {
      jasmineConsoleReporter(port, callback);
    } else {
      portfinder.getPort(function(err, port) {
        if (err) return callback(err);
        var env = Object.assign({}, process.env, {JASMINE_PORT: port});
        var server = spawn('./node_modules/.bin/gulp', ['jasmine'], {env});
        server.stdout.on('data', function(data) {
          var output = data.toString();
          if (output.includes('Jasmine server listening on ')) {
            jasmineConsoleReporter(port, function(err) {
              process.kill(server.pid, 'SIGINT');
              callback(err);
            });
          }
        });
      });
    }
  });
});

gulp.task('jasmine-assets', function() {
  return gulp.src(['spec/spec.js', 'spec/app/**/*_spec.js'])
    .pipe(plugins.cached('jasmine-javascript'))
    .pipe(plugins.webpack(require('../config/webpack/test')))
    .pipe(gulp.dest('tmp/jasmine'));
});

gulp.task('jasmine-server', function() {
  function createServer({port, onReady}) {
    var app = express();
    app.use(express.static(__dirname + '/../tmp/jasmine'));
    app.use(express.static(__dirname + '/../spec/app/public'));
    app.listen(port, onReady && function() { onReady(port); });
    return app;
  }
  var port = process.env.JASMINE_PORT || 8888;
  createServer({port, onReady: port => plugins.util.log(`Jasmine server listening on ${port}`)});
});

gulp.task('jasmine', ['jasmine-assets', 'jasmine-server']);