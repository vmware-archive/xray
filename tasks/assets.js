var gulp = require('gulp');
var del = require('del');
var plugins = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
const COPYRIGHT = '/*(c) Copyright 2015 Pivotal Software, Inc. All Rights Reserved.*/\n';

function isProduction() {
  return process.env.NODE_ENV === 'production';
}

gulp.task('assets-javascript', function() {
  return gulp.src('app/components/application.js')
    .pipe(plugins.plumber())
    .pipe(plugins.webpack(require('../config/webpack/config')(process.env.NODE_ENV)))
    .pipe(plugins.header(COPYRIGHT))
    .pipe(gulp.dest('public'));
});

function sass() {
  return gulp.src(['app/stylesheets/application.scss'])
    .pipe(plugins.plumber())
    .pipe(plugins.if(!isProduction(), plugins.sourcemaps.init()))
    .pipe(plugins.sass())
    .pipe(plugins.autoprefixer())
    .pipe(plugins.if(!isProduction(), plugins.sourcemaps.write()))
    .pipe(plugins.if(isProduction(), plugins.minifyCss()))
    .pipe(plugins.header(COPYRIGHT));
}

gulp.task('assets-stylesheets', function() {
  sass().pipe(gulp.dest('public'));
});

gulp.task('watch-assets', function() {
  gulp.watch('app/stylesheets/**/*.scss', ['assets-stylesheets']);
});

gulp.task('clean-assets-javascript', function(callback) {
  del(['public/application.js*'], callback);
});

gulp.task('clean-assets-stylesheets', function(callback) {
  del(['public/application.css'], callback);
});

gulp.task('clean-assets', ['clean-assets-javascript', 'clean-assets-stylesheets']);

gulp.task('assets', function(callback) {
  runSequence('clean-assets', ['assets-javascript', 'assets-stylesheets'], callback);
});

module.exports = {
  sass
};