var gulp = require('gulp'),
    path = require('path'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    webpack = require('webpack'),
    babelLoader = require('babel-loader'),
    fs = require('fs'),
    uglify = require('gulp-uglify');

var BUILD = process.env.NODE_ENV === 'production'; 

if( ! BUILD ) {
  var browserSync = require('browser-sync').create(),
      reload = browserSync.reload,
      nodemon = require('nodemon');
}

gulp.task('default',['serve'],function() {});

gulp.task('build',['sass','webpack','compress'],function() { });

gulp.task('compress',function() {
  return gulp.src(['node_modules/babel-core/browser.js','node_modules/traceur/bin/traceur.js'])
    .pipe(uglify())
    .pipe(gulp.dest('static/dist/compilers'));
});

gulp.task('webpack',function(callback) {
  var init = false;

  webpack({
    entry : './static/js/index.js',

    output : {
      publicPath: '/dist/js/',
      path : path.join(__dirname, 'static/dist/js'),
      filename : 'bundle.js'
    },

    watch : !BUILD,
    devtool : BUILD ? '' : '#source-map',

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
    },

    plugins : BUILD ? [ new webpack.optimize.UglifyJsPlugin({ sourceMap: false }) ] : []

  }, function( err, stats ) {
    if(err) throw new gutil.PluginError('webpack',err);

    var jsonStats = stats.toJson();
    if(jsonStats.errors.length > 0) 
      jsonStats.errors.forEach(function(error) {
        gutil.log(gutil.colors.cyan('webpack'),gutil.colors.bold.red('error'),error);
      });
    if(!BUILD && jsonStats.warnings.length > 0) 
      jsonStats.warnings.forEach(function(warning) { 
        gutil.log(gutil.colors.magenta('webpack'),gutil.colors.bold.yellow('warning'),warning);
      });

    if(!BUILD) { 
      fs.writeFile("./webpack-stats.json", JSON.stringify(jsonStats), function(err) { if(err) gutil.log(gutil.colors.red('error saving webpack stats'),err);
      });
      reload();
    }
    if(!init) { callback(); init = true; }
  });
});

gulp.task('sass',function() {
  var stream = gulp.src('./static/sass/**/*.scss')
    .pipe(sass({
      outputStyle : BUILD ? 'compressed' : 'nested'
    })).on('error', sass.logError)
    .pipe(gulp.dest('./static/style'));
    
    if(!BUILD) return stream.pipe(reload({stream:true}));
    else return stream;
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

