var gulp = require('gulp');
var nib = require('nib');
var plugins = require('gulp-load-plugins')();

gulp.task('assets-javascript', function() {
  return gulp.src('app/components/application.js')
    .pipe(plugins.plumber())
    .pipe(plugins.webpack(require(`../config/webpack/${process.env.NODE_ENV}`)))
    .pipe(gulp.dest('public'));
});

gulp.task('assets-stylesheets', function() {
  return gulp.src(['app/stylesheets/application.styl', 'app/stylesheets/reset.styl'])
    .pipe(plugins.plumber())
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.stylus({
      use: nib()
    }))
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest('public'));
});

gulp.task('watch-assets', function() {
  gulp.watch('app/stylesheets/**/*.styl', ['assets-stylesheets']);
});

gulp.task('assets', ['assets-javascript', 'assets-stylesheets']);