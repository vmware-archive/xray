var gulp = require('gulp');
var nib = require('nib');
var plugins = require('gulp-load-plugins')();

function isProduction() {
  return process.env.NODE_ENV === 'production';
}

gulp.task('assets-javascript', function() {
  return gulp.src('app/components/application.js')
    .pipe(plugins.plumber())
    .pipe(plugins.webpack(require(`../config/webpack/${process.env.NODE_ENV}`)))
    .pipe(plugins.if(isProduction(), plugins.uglify()))
    .pipe(gulp.dest('public'));
});

gulp.task('assets-stylesheets', function() {
  return gulp.src(['app/stylesheets/application.styl', 'app/stylesheets/reset.styl'])
    .pipe(plugins.plumber())
    .pipe(plugins.if(!isProduction(), plugins.sourcemaps.init()))
    .pipe(plugins.stylus({
      use: nib(),
      compress: isProduction()
    }))
    .pipe(plugins.if(!isProduction(), plugins.sourcemaps.write()))
    .pipe(gulp.dest('public'));
});

gulp.task('watch-assets', function() {
  gulp.watch('app/stylesheets/**/*.styl', ['assets-stylesheets']);
});

gulp.task('assets', ['assets-javascript', 'assets-stylesheets']);