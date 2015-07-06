var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var sh = require('shelljs');
var wrench = require('wrench');


/******************************************************************************
 * Config Options
 *****************************************************************************/
var options = {
  errorHandler: function(title) {
    return function(err) {
      gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
      this.emit('end');
    };
  },
  wiredep: {
    directory: 'www/lib',
    exclude: ['ionic', 'angular']
  },
  paths: {
    sass: ['./www/scss/**/*.scss', './www/app/**/*.scss'],
    scripts: './www/app/**/*.js'
  }
};


/******************************************************************************
 * Load tasks from the /gulp directory
 *****************************************************************************/
wrench.readdirSyncRecursive('./gulp').filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file)(options);
});


/******************************************************************************
 * Tasks
 *****************************************************************************/

gulp.task('watch', ['inject'], function() {
  gulp.watch(options.paths.sass, function(event) {
    gulp.start('sass');
  });
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('default', ['inject']);