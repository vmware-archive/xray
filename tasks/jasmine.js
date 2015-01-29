var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('spec', ['spec-server']);

gulp.task('spec-server', function() {
  return gulp.src('spec/server/**/*.js')
    .pipe(plugins.jasmine());
});