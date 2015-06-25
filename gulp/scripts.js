(function() {
  'use strict';

  module.exports = function(options) {

  // TODO (Erik Hellenbrand) : Run Unit Tests on changes to js files
    var gulp = require('gulp');
    var $ = require('load-gulp-plugins')();
    var noop

    gulp.task('scripts', function() {
      gulp.src(options.paths.scripts)
      .pipe($.jshint())
      .pipe($.jscs({preset: 'airbnb'})).on('error', $.util.noop())
      .pipe($.jscsStylish.combineWithHintResults())
      .pipe($.jshint.reporter('jshint-stylish'))

    });

  };

})();