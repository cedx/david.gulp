/**
 * Build system.
 * @module gulpfile
 */
'use strict';

// Module dependencies.
var child=require('child_process');
var david=require('./index');
var del=require('del');
var gulp=require('gulp');
var plugins=require('gulp-load-plugins')();
var pkg=require('./package.json');
var util=require('util');

/**
 * Provides tasks for [Gulp.js](http://gulpjs.com) build system.
 * @class cli.Gulpfile
 * @static
 */

/**
 * The task settings.
 * @property config
 * @type Object
 */
var config={
  output: util.format('%s-%s.zip', pkg.yuidoc.name.toLowerCase(), pkg.version)
};

/**
 * Runs the default tasks.
 * @method default
 */
gulp.task('default', [ 'dist' ]);

/**
 * Checks the package dependencies.
 * @method check
 */
gulp.task('check', function() {
  return gulp.src('package.json')
    .pipe(david())
    .pipe(david.reporter);
});

/**
 * Deletes all generated files and reset any saved state.
 * @method clean
 */
gulp.task('clean', function(callback) {
  del('var/'+config.output, callback);
});

/**
 * Creates a distribution file for this program.
 * @method dist
 */
gulp.task('dist', function() {
  var sources=[
    '*.json',
    '*.md',
    '*.txt',
    'index.js',
    'example/*.js',
    'lib/*.js',
    'test/*.js'
  ];

  return gulp.src(sources, { base: '.' })
    .pipe(plugins.zip(config.output))
    .pipe(gulp.dest('var'));
});

/**
 * Builds the documentation.
 * @method doc
 */
gulp.task('doc', [ 'doc:assets' ], function(callback) {
  _exec('docgen', callback);
});

gulp.task('doc:assets', function() {
  return gulp.src([ 'www/apple-touch-icon.png', 'www/favicon.ico' ])
    .pipe(gulp.dest('doc/api/assets'));
});

/**
 * Performs static analysis of source code.
 * @method lint
 */
gulp.task('lint', [ 'lint:doc', 'lint:js' ]);

gulp.task('lint:doc', function(callback) {
  _exec('docgen --lint', callback);
});

gulp.task('lint:js', function() {
  return gulp.src([ '*.js', 'example/*.js', 'lib/*.js', 'test/*.js' ])
    .pipe(plugins.jshint(pkg.jshintConfig))
    .pipe(plugins.jshint.reporter('default', { verbose: true }));
});

/**
 * Runs the unit tests.
 * @method test
 */
gulp.task('test', function() {
  return gulp.src([ 'test/*.js' ], { read: false })
    .pipe(plugins.mocha());
});

/**
 * Runs a command and prints its output.
 * @method _exec
 * @param {String} command The command to run, with space-separated arguments.
 * @param {Function} callback The function to invoke when the task is over.
 * @async
 * @private
 */
function _exec(command, callback) {
  child.exec(command, function(err, stdout) {
    var output=stdout.trim();
    if(output.length) console.log(output);
    if(err) console.error(err);
    callback();
  });
}
