var gulp = require('gulp');
var del = require('del');
var drFrankenstyle = require('dr-frankenstyle');
var File = require('vinyl');
var mergeStream = require('merge-stream');
var path = require('path');
var plugins = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var through2 = require('through2');
const COPYRIGHT = '/*(c) Copyright 2015 Pivotal Software, Inc. All Rights Reserved.*/\n';

function isProduction() {
  return process.env.NODE_ENV === 'production';
}

function javascript(options = {}) {
  var webpackConfig = Object.assign({}, require('../config/webpack/config')(process.env.NODE_ENV), options);
  return gulp.src(['app/components/application.js', 'app/components/setup.js'])
    .pipe(plugins.plumber())
    .pipe(plugins.webpack(webpackConfig))
    .pipe(plugins.header(COPYRIGHT))
    .pipe(through2.obj(function(file, encoding, callback) {
      callback(null, Object.assign(file, {path: path.basename(file.path)}));
    }));
}

function sass() {
  return gulp.src(['app/stylesheets/application.scss'], {base: '.'})
    .pipe(plugins.plumber())
    .pipe(plugins.if(!isProduction(), plugins.sourcemaps.init()))
    .pipe(plugins.sass())
    .pipe(plugins.autoprefixer())
    .pipe(plugins.if(!isProduction(), plugins.sourcemaps.write()))
    .pipe(plugins.if(isProduction(), plugins.minifyCss()))
    .pipe(plugins.header(COPYRIGHT))
    .pipe(plugins.rename({dirname: ''}));
}

function puiStylesheets() {
  var stream = through2.obj();
  drFrankenstyle(css => (stream.write(new File({path: 'pui.css', contents: new Buffer(css)})), stream.end()));
  return stream;
}

function fonts() {
  return gulp.src(['vendor/pui-v1.4.0/fonts/*', 'node_modules/font-awesome/fonts/*'], {base: '.'})
    .pipe(plugins.rename({dirname: 'fonts'}));
}

function images() {
  return gulp.src('app/images/**', {base: '.'})
    .pipe(plugins.rename({dirname: 'images'}));
}

gulp.task('assets-stylesheets', function() {
  return sass().pipe(gulp.dest('public'));
});

gulp.task('watch-assets', function() {
  gulp.watch('app/stylesheets/**/*.scss', ['assets-stylesheets']);
});

gulp.task('clean-assets', callback => del(['public/*', '!public/.gitkeep'], callback));

gulp.task('assets-all', function() {
  var stream = mergeStream(
    javascript({watch: !isProduction()}),
    sass(),
    fonts(),
    puiStylesheets(),
    images()
  );

  if (process.env.NODE_ENV !== 'production') return stream.pipe(gulp.dest('public'));
  var cloneSink = plugins.clone.sink();
  return stream
    .pipe(gulp.dest('public'))
    .pipe(plugins.rev())
    .pipe(cloneSink)
    .pipe(gulp.dest('public'))
    .pipe(plugins.rev.manifest())
    .pipe(gulp.dest('public'))
    .pipe(cloneSink.tap())
    .pipe(plugins.gzip())
    .pipe(gulp.dest('public'));
});

gulp.task('assets', function(callback) {
  runSequence('clean-assets', 'assets-all', callback);
});

module.exports = {sass};