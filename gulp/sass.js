(function() {
  'use strict';

  module.exports = function(options) {
    /******************************************************************************
     * Dependencies
     *****************************************************************************/
    var gulp = require('gulp');
    var $ = require('gulp-load-plugins')();
    var wiredep = require('wiredep').stream;

    gulp.task('sass', function() {

      /******************************************************************************
       * Config
       *****************************************************************************/
      var injectMain = gulp.src('./www/app/core/app.scss', { read: false });

      var injectFiles = gulp.src(['./www/app/**/*.scss', '!./www/app/core/app.scss'], { read: false });

      var injectOptions = {
        transform: function(filePath) {
          filePath = filePath.replace('www', '..');
          return '@import \'' + filePath + '\';';
        },
        starttag: '// injector',
        endtag: '// endinjector',
        addRootSlash: false,
        relative: true
      };

      var mainInjectOptions = {
        transform: function(filePath) {
          filePath = filePath.replace('www', '..');
          return '@import \'' + filePath + '\';';
        },
        starttag: '// maininjector',
        endtag: '// endmaininjector',
        addRootSlash: false,
        relative: true
      };

      var indexFilter = $.filter('branch2.scss');

      /******************************************************************************
       * Task
       *****************************************************************************/

      // Uncomment the first line and comment out the second
      // if any changes to the ionic styles have been made
      // return gulp.src('./www/scss/*.scss')
      return gulp.src('www/scss/branch2.scss')
      // .pipe(indexFilter)
      .pipe($.inject(injectMain, mainInjectOptions))
      .pipe($.inject(injectFiles, injectOptions))
      .pipe(gulp.dest('./www/scss'))
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