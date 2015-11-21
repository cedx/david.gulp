'use strict';

// Module dependencies.
const exec = require('child_process').exec;
const gulp = require('gulp');
const david = require('gulp-david');
const Transform = require('stream').Transform;

// Runs the default tasks.
gulp.task('default', ['upgradePackages']);

// Checks the package dependencies.
// Throws an error if five or more of them are outdated.
gulp.task('checkDependencies', () =>
  gulp.src('package.json')
    .pipe(david({ error404: true, errorDepType: true }))
    .pipe(david.reporter)
    .pipe(new Transform({
      objectMode: true,
      transform(file, encoding, callback) {
        let dependencyCount = Object.keys(file.david)
          .reduce((previousValue, depType) => previousValue + Object.keys(file.david[depType]).length, 0);

        let threshold = 5;
        callback(dependencyCount >= threshold ? new Error('Too many outdated dependencies.') : null, file);
      }
    }))
);

// Updates the package manifest.
gulp.task('updateManifest', ['checkDependencies'], () =>
  gulp.src('package.json')
    .pipe(david({ update: true }))
    .pipe(gulp.dest('.'))
);

// Upgrades the packages to latest versions.
gulp.task('upgradePackages', ['updateManifest'], callback =>
  exec('npm update', (err, stdout) => {
    let output=stdout.trim();
    if(output.length) console.log(output);
    if(err) console.error(err);
    callback();
  })
);
