var gulp = require('gulp');
var del = require('del');
var drFrankenstyle = require('gulp-dr-frankenstyle');
var mergeStream = require('merge-stream');
var path = require('path');
var plugins = require('gulp-load-plugins')();
var React = require('react');
var runSequence = require('run-sequence');
var through2 = require('through2');
const COPYRIGHT = '/*(c) Copyright 2015 Pivotal Software, Inc. All Rights Reserved.*/\n';

function isProduction() {
  return process.env.NODE_ENV === 'production';
}

function javascriptStatic() {
  return gulp.src(require.resolve(`react/dist/react-with-addons${isProduction() ? '.min' : ''}`))
    .pipe(plugins.rename({basename: `react-${React.version}`}));
}

function javascript(options = {}) {
  var webpackConfig = Object.assign({}, require('../config/webpack')(process.env.NODE_ENV), options);
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
    javascriptStatic(),
    javascript({watch: !isProduction()}),
    sass(),
    drFrankenstyle(),
    images()
  );

  if (isProduction()) {
    return stream
      .pipe(plugins.rev())
      .pipe(drFrankenstyle.done())
      .pipe(gulp.dest('public'))
      .pipe(plugins.rev.manifest())
      .pipe(gulp.dest('public'));
  } else {
    return stream
      .pipe(drFrankenstyle.done())
      .pipe(gulp.dest('public'));
  }
});

gulp.task('assets-gzip', function() {
  if (isProduction()) {
    return gulp.src('public/**/*')
      .pipe(plugins.gzip())
      .pipe(gulp.dest('public'));
  }
});

gulp.task('assets', function(callback) {
  runSequence('clean-assets', 'assets-all', 'assets-gzip', callback);
});

module.exports = {sass};
