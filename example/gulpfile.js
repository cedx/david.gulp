'use strict';

const {david} = require('@cedx/gulp-david');
const {spawn} = require('child_process');
const gulp = require('gulp');
const {normalize} = require('path');

/**
 * Runs the default tasks.
 */
gulp.task('default', ['upgradePackages']);

/**
 * Checks the package dependencies, and emits an error if some of them are outdated.
 */
gulp.task('checkDependencies', () => gulp.src('package.json')
  .pipe(david({error404: true, errorDepCount: 1, errorDepType: true}))
  .on('error', function(err) {
    console.error(err);
    this.emit('end');
  })
);

/**
 * Prints a detailled report about the dependencies.
 */
gulp.task('printDependencyReport', () => gulp.src('package.json')
  .pipe(david({verbose: true}))
);

/**
 * Updates the package manifest using the tilde operator.
 */
gulp.task('updateManifest', () => gulp.src('package.json')
  .pipe(david({update: '~'}))
  .pipe(gulp.dest('.'))
);

/**
 * Upgrades the packages to latest versions.
 */
gulp.task('upgradePackages', ['updateManifest'], () => _exec('npm', ['update']));

/**
 * Spawns a new process using the specified command.
 * @param {string} command The command to run.
 * @param {string[]} [args] The command arguments.
 * @param {Object} [options] The settings to customize how the process is spawned.
 * @return {Promise} Completes when the command is finally terminated.
 */
async function _exec(command, args = [], options = {shell: true, stdio: 'inherit'}) {
  return new Promise((resolve, reject) => spawn(normalize(command), args, options)
    .on('close', code => code ? reject(new Error(`${command}: ${code}`)) : resolve())
  );
}
