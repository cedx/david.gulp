'use strict';

// Module dependencies.
const exec = require('child_process').exec;
const gulp = require('gulp');
const david = require('gulp-david');

// Runs the default tasks.
gulp.task('default', ['upgradePackages']);

// Checks the package dependencies.
// Emits an error if five or more of them are outdated.
gulp.task('checkDependencies', () =>
  gulp.src('package.json')
    .pipe(david({ error404: true, errorDepCount: 5, errorDepType: true }))
    .pipe(david.reporter)
);

// Updates the package manifest.
gulp.task('updateManifest', () =>
  gulp.src('package.json')
    .pipe(david({ update: true }))
    .pipe(gulp.dest('.'))
);

// Upgrades the packages to latest versions.
gulp.task('upgradePackages', ['updateManifest'], callback =>
  exec('npm update', (err, stdout) => {
    let output=stdout.trim();
    if(output.length) console.log(output);
    if(err) callback(err);
    else callback();
  })
);
