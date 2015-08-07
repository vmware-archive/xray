var gulp = require('gulp');
var mergeStream = require('merge-stream');
var plugins = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var {sass} = require('./assets');
var webpack = require('webpack-stream');

gulp.task('spec', function(callback) {
  runSequence('lint', 'spec-server', 'spec-app', callback);
});

gulp.task('spec-server', function() {
  return gulp.src('spec/server/**/*_spec.js')
    .pipe(plugins.plumber())
    .pipe(plugins.jasmine({includeStackTrace: true}));
});

function testAssets(options = {}) {
  var config = Object.assign(require('../config/webpack')('test'), options);
  var javascript = gulp.src('spec/app/**/*_spec.js')
    .pipe(webpack(config));
  return mergeStream(
    gulp.src(require.resolve('react/dist/react-with-addons')),
    javascript,
    sass(),
    gulp.src('spec/support/jasmine.css')
  );
}

gulp.task('spec-app', function() {
  return testAssets({watch: false})
    .pipe(plugins.jasmineBrowser.specRunner({console: true}))
    .pipe(plugins.jasmineBrowser.phantomjs());
});

gulp.task('jasmine', function() {
  var plugin = new (require('gulp-jasmine-browser/webpack/jasmine-plugin'))();
  return testAssets({plugins: [plugin]})
    .pipe(plugins.jasmineBrowser.specRunner())
    .pipe(plugins.jasmineBrowser.server({whenReady: plugin.whenReady}));
});