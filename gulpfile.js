var gulp = require('gulp'),
    path = require('path'),
    gutil = require('gulp-util'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    sass = require('gulp-sass'),
    nodemon = require('nodemon'),
    webpack = require('webpack'),
    babelLoader = require('babel-loader');

gulp.task('default',['serve'],function() {});

gulp.task('webpack',function(callback) {
  var init = false;

  webpack({
    entry : './static/js/index.js',

    output : {
      publicPath: '/dist/js/',
      path : path.join(__dirname, 'static/dist/js'),
      filename : 'bundle.js'
    },

    watch : true,
    devtool : '#source-map',

    resolve : { 
      alias : {
        fs : 'browserify-fs'
      }
    },

    node : {
      process: true
    },

    module : {
      loaders : [
        { test: /\.js$/, loader: 'babel-loader', exclude: /(node_modules)/ }
      ]
    }
  }, function( err, stats ) {
    if(err) throw new gutil.PluginError('webpack',err);
    gutil.log("[webpack]",stats.toString({
      cached: false,
      colors: true
    }));
    reload();
    if(!init) { callback(); init = true; }
  });
});

gulp.task('sass',function() {
  gulp.src('./static/sass/**/*.scss')
    .pipe(sass()).on('error', sass.logError)
    .pipe(gulp.dest('./static/style'))
    .pipe(reload({stream:true}));
});

gulp.task('serve',['nodemon','webpack'],function() {
  browserSync.init(null,{
    proxy : 'http://localhost:3000',
    port : 7000
  });

  gulp.watch('static/sass/**/*.scss',['sass']);
  gulp.watch(["static/index.html"]).on("change",reload);
});

gulp.task('nodemon',function(cb) {
  var init = true;

  nodemon({
    script: 'app.js',
    watch: ['app.js']
  }).on('start', function() { 
    if(init) cb(); // Only call cb once when server is started initially.
    setTimeout(function() { reload(); },1000);
    init = false; 
  });
});

