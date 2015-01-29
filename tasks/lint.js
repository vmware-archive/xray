var gulp = require('gulp');
var jshint = require('gulp-jshint');

gulp.task('lint', function () {
  return gulp.src(['**/*.js', '!node_modules/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});