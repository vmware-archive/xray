var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('assets', function() {
  return gulp.src('app/components/application.js')
    .pipe(plugins.webpack({
      devTool: 'eval',
      module: {
        loaders: [
          {test: /\.js$/, exclude: /node_modules/, loader: '6to5-loader'}
        ]
      },
      output: {
        filename: 'application.js'
      },
      watch: true
    }))
    .pipe(gulp.dest('public'));
});