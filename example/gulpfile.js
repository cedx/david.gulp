'use strict';

// Module dependencies.
const david = require('gulp-david');
const exec = require('child_process').exec;
const gulp = require('gulp');

// Runs the default tasks.
gulp.task('default', ['upgradePackages']);

// Checks the package dependencies.
// Emits an error if some of them are outdated.
gulp.task('checkDependencies', () => gulp.src('package.json')
  .pipe(david({ error404: true, errorDepCount: 1, errorDepType: true }))
  .on('error', function(err) {
    console.error(err);
    this.emit('end');
  })
);

// Updates the package manifest.
gulp.task('updateManifest', () => gulp.src('package.json')
  .pipe(david({ update: true }))
  .pipe(gulp.dest('.'))
);

// Upgrades the packages to latest versions.
gulp.task('upgradePackages', ['updateManifest'], callback =>
  exec('npm update', (err, stdout) => {
    let output = stdout.trim();
    if(output.length) console.log(output);
    if(err) callback(err);
    else callback();
  })
);
