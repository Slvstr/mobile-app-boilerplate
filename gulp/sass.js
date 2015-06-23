(function() {
  'use strict';

  /******************************************************************************
   * Dependencies
   *****************************************************************************/
  var gulp = require('gulp');
  var $ = require('gulp-load-plugins')();
  var wiredep = require('wiredep').stream;

  module.exports = function(options) {

    /******************************************************************************
     * Config
     *****************************************************************************/
    var injectFiles = gulp.src('www/app/**/*.scss', { read: false });

    var injectOptions = {
      transform: function(filePath) {
        filePath = filePath.replace('www', '..');
        return '@import \'' + filePath + '\';';
      },
      starttag: '// injector',
      endtag: '// endinjector',
      addRootSlash: false
    };

    var indexFilter = $.filter('app.scss');

    /******************************************************************************
     * Task
     *****************************************************************************/
    gulp.task('sass', function() {

      // Uncomment the first line and comment out the second
      // if any changes to the ionic styles have been made
      // return gulp.src('./www/scss/*.scss')
      return gulp.src('www/scss/app.scss')
      // .pipe(indexFilter)
      .pipe($.inject(injectFiles, injectOptions))
      // .pipe(gulp.dest('./www/scss'))
      // .pipe(indexFilter.restore())
      .pipe($.sourcemaps.init())
      .pipe($.sass({errLogToConsole: true})).on('error', options.errorHandler('Sass'))
      .pipe($.autoprefixer()).on('error', options.errorHandler('Autoprefixer'))
      .pipe($.csso())
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest('./www/css/'));

    });

  };

})();