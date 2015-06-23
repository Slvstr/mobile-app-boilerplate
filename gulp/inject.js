(function() {
  'use strict';



  module.exports = function(options) {
    var gulp = require('gulp');
    var $ = require('gulp-load-plugins')();
    var wiredep = require('wiredep').stream;


    gulp.task('inject', ['sass'], function() {
      var injectCSS = gulp.src(['./www/css/*.css'], {read: false});
      var injectScripts = gulp.src([
        './www/app/**/*.js',
        '!./www/app/**/*.spec.js',
        '!./www/app/**/*.mock.js'
      ])
      .pipe($.angularFilesort()); //.on('error', options.errorHandler('AngularFilesort'));

      var injectOptions = {
        addRootSlash: false,
        ignorePath: 'www'
      };


      return gulp.src('./www/index.html')
        .pipe($.inject(injectCSS, injectOptions))
        .pipe($.inject(injectScripts, injectOptions))
        .pipe(wiredep(options.wiredep))
        .pipe(gulp.dest('./www'));

    });
  };

})();