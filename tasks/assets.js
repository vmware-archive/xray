var gulp = require('gulp');
var del = require('del');
var drFrankenstyle = require('dr-frankenstyle');
var mergeStream = require('merge-stream');
var path = require('path');
var plugins = require('gulp-load-plugins')();
var React = require('react');
var runSequence = require('run-sequence');
var through2 = require('through2');
var webpack = require('webpack-stream');

const COPYRIGHT = '/*(c) Copyright 2015 Pivotal Software, Inc. All Rights Reserved.*/\n';

function isProduction() {
  return process.env.NODE_ENV === 'production';
}

function isDevelopment() {
  return process.env.NODE_ENV === 'development';
}

function rename(options = {}) {
  return through2.obj(function(file, encoding, callback) {
    var {base = process.cwd(), path: p = path.basename(file.path)} = options;
    callback(null, Object.assign(file, {base, path: p}));
  });
}

function javascriptStatic() {
  return gulp.src(require.resolve(`react/dist/react-with-addons${isProduction() ? '.min' : ''}`))
    .pipe(rename({path: `react-${React.version}.js`}));
}

function javascript(options = {}) {
  var webpackConfig = Object.assign({}, require('../config/webpack')(process.env.NODE_ENV), options);
  return gulp.src(['app/components/application.js', 'app/components/setup.js'])
    .pipe(plugins.plumber())
    .pipe(webpack(webpackConfig))
    .pipe(plugins.header(COPYRIGHT))
    .pipe(rename());
}

function sass({watch = false} = {}) {
  var stream = gulp.src('app/stylesheets/application.scss').pipe(plugins.plumber());
  if (watch) {
    stream = stream
      .pipe(plugins.watch('app/stylesheets/**/*.scss'))
      .pipe(plugins.sassGraphAbs([path.join(__dirname, '..', 'app', 'stylesheets')]));
  }
  return stream
    .pipe(plugins.if(!isProduction(), plugins.sourcemaps.init()))
    .pipe(plugins.sass())
    .pipe(plugins.autoprefixer())
    .pipe(plugins.if(!isProduction(), plugins.sourcemaps.write()))
    .pipe(plugins.if(isProduction(), plugins.minifyCss()))
    .pipe(plugins.header(COPYRIGHT))
    .pipe(rename());
}

function images() {
  return gulp.src('app/images/**/*', {base: '.'})
    .pipe(plugins.rename({dirname: 'images'}));
}

function all() {
  var watch = isDevelopment();
  return mergeStream(
    javascriptStatic(),
    javascript({watch}),
    sass({watch}),
    drFrankenstyle(),
    images()
  );
}

gulp.task('assets-stylesheets', function() {
  return sass().pipe(gulp.dest('public'));
});

gulp.task('clean-assets', callback => del(['public/*', '!public/.gitkeep'], callback));

gulp.task('assets-all', function() {
  var stream = all();
  if (isProduction()) {
    stream = stream
      .pipe(plugins.rev())
      .pipe(plugins.revCssUrl())
      .pipe(gulp.dest('public'))
      .pipe(plugins.rev.manifest())
  }
  return stream.pipe(gulp.dest('public'));
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

gulp.task('assets-server', function() {
  var {assetPort: port} = require('../server/config');
  return all()
    .pipe(plugins.webserver({
      directoryListing: true,
      livereload: true,
      port
    }));
});

module.exports = {sass};
