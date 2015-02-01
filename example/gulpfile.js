'use strict';

// Module dependencies.
var exec = require('child_process').exec;
var gulp = require('gulp');
var david = require('gulp-david');

// Runs the default tasks.
gulp.task('default', [ 'updatePackages' ]);

// Checks the package dependencies.
gulp.task('checkDependencies', function() {
  return gulp.src('package.json')
    .pipe(david({ error404: true, errorDepType: true }))
    .pipe(david.reporter);
});

// Updates the package manifest.
gulp.task('updateManifest', function() {
  return gulp.src('package.json')
    .pipe(david({ update: true }))
    .pipe(david.reporter)
    .pipe(gulp.dest('.'));
});

// Updates the packages to latest versions.
gulp.task('updatePackages', [ 'updateManifest' ], function(callback) {
  exec('npm update', function(err, stdout) {
    console.log(stdout.trim());
    if(err) callback(err);
    else callback();
  });
});
