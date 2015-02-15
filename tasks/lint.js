var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('lint', function () {
  return gulp.src(['**/*.js', '!public/**/*.js', '!node_modules/**/*.js', '!vendor/**/*.js', '!spec/app/public/**/*.js', '!spec/support/vendor/**/*.js', '!app/vendor/**/*.js', '!tmp/**/*.js'])
    .pipe(plugins.plumber())
    .pipe(plugins.babel())
    .pipe(plugins.react({es6: true}))
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'))
    .pipe(plugins.jshint.reporter('fail'));
});