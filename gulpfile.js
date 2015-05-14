var gulp = require('gulp');
var gutil = require('gulp-util');
var babelify = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

gulp.task('default',function() {
  var b = browserify({
    entries : 'js/index.js',
    debug : true,
  });

  return b.transform(babelify)
        .on('error', gutil.log)
      .bundle()
        .on('error', gutil.log)
      .pipe(source('bundle.js'))
        .on('error', gutil.log)
      .pipe(gulp.dest('./dist/js/'))
      .pipe(reload({stream:true}));
});

gulp.task('serve',function() {
  browserSync.init({
    server : './'
  });

  gulp.watch("js/**/*.js",['default']);
  gulp.watch(["index.html","style/*.css"]).on("change",reload);
});

gulp.task('watch',function() {
  gulp.watch("js/**/*.js", ['default']);
});
