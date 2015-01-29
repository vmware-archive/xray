var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('assets', function() {
  return gulp.src('app/components/application.js')
    .pipe(plugins.webpack(require(`../config/webpack/${process.env.NODE_ENV}`)))
    .pipe(gulp.dest('public'));
});