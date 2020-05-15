'use strict';
const {david} = require('@cedx/gulp-david');
const {exec} = require('child_process');
const {dest, series, src, task} = require('gulp');

/** Checks the package dependencies, and emits an error if some of them are outdated. */
task('checkDependencies', () => src('package.json')
  .pipe(david({
    error404: true,
    errorDepCount: 1,
    errorDepType: true
  }))
  .on('error', function(err) {
    console.error(err.message);
    this.emit('end');
  })
);

/** Prints a detailled report about the dependencies. */
task('printDependencyReport', () => src('package.json')
  .pipe(david({verbose: true}))
);

/** Updates the package manifest using the tilde operator. */
task('updateManifest', () => src('package.json')
  .pipe(david({update: '~'}))
  .pipe(dest('.'))
);

/** Upgrades the packages to latest versions. */
task('upgradePackages:npmInstall', () => exec('npm install --ignore-scripts'));
task('upgradePackages:npmUpdate', () => exec('npm update --dev'));
task('upgradePackages', series('updateManifest', 'upgradePackages:npmInstall', 'upgradePackages:npmUpdate'));

/** Runs the default tasks. */
task('default', task('upgradePackages'));
