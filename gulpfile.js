var gulp = require('gulp');
		 gutil = require('gulp-util'),
		 babelify = require('babelify'),
		 browserify = require('browserify'),
		 source = require('vinyl-source-stream'),
		 browserSync = require('browser-sync').create(),
		 reload = browserSync.reload,
		 sass = require('gulp-sass');

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

gulp.task('sass',function() {
  gulp.src('./sass/**/*.scss')
    .pipe(sass()).on('error', sass.logError)
    .pipe(gulp.dest('./style'))
    .pipe(reload({stream:true}));
});

gulp.task('serve',function() {
  browserSync.init({
    server : './'
  });

  gulp.watch("js/**/*.js",['default']);
  gulp.watch('sass/**/*.scss',['sass']);
  gulp.watch(["index.html"]).on("change",reload);
});

gulp.task('watch',function() {
  gulp.watch("js/**/*.js", ['default']);
  gulp.watch('sass/**/*.scss',['sass']);
});
