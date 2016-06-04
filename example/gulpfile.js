'use strict';

// Module dependencies.
const child = require('child_process');
const david = require('gulp-david');
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

// Updates the package manifest using the tilde operator.
gulp.task('updateManifest', () => gulp.src('package.json')
  .pipe(david({ update: '~' }))
  .pipe(gulp.dest('.'))
);

// Upgrades the packages to latest versions.
gulp.task('upgradePackages', ['updateManifest'], () => new Promise((resolve, reject) =>
  child.exec('npm update', (err, stdout) => {
    console.log(stdout.trim());
    if(err) reject(err);
    else resolve();
  })
));
