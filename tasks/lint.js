var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('lint', function() {
  return gulp.src(['gulpfile.js', 'app/**/*.js', '!app/vendor/**/*.js', 'lib/**/*.js', 'helpers/**/*.js', 'server/**/*.js', 'tasks/**/*.js', 'spec/**/*.js', '!spec/app/public/lib/**/*.js'])
    .pipe(plugins.plumber())
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format('stylish'))
    .pipe(plugins.eslint.failOnError());
});