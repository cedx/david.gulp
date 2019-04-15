'use strict';

/* tslint:disable: no-console */
const {david} = require('@cedx/gulp-david');
const {spawn} = require('child_process');
const {dest, series, src, task} = require('gulp');
const {normalize} = require('path');

/** Checks the package dependencies, and emits an error if some of them are outdated. */
task('checkDependencies', () => src('package.json')
  .pipe(david({
    error404: true,
    errorDepCount: 1,
    errorDepType: true
  }))
  .on('error', function(err) {
    console.error(err);
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
task('upgradePackages:npmInstall', () => _exec('npm', ['install', '--ignore-scripts']));
task('upgradePackages:npmUpdate', () => _exec('npm', ['update', '--dev']));
task('upgradePackages', series('updateManifest', 'upgradePackages:npmInstall'));

/** Runs the default tasks. */
task('default', task('upgradePackages'));

/**
 * Spawns a new process using the specified command.
 * @param {string} command The command to run.
 * @param {string[]} [args] The command arguments.
 * @param {Partial<SpawnOptions>} [options] The settings to customize how the process is spawned.
 * @return {Promise<void>} Completes when the command is finally terminated.
 */
function _exec(command, args = [], options = {}) {
  return new Promise((fulfill, reject) => spawn(normalize(command), args, Object.assign({shell: true, stdio: 'inherit'}, options))
    .on('close', code => code ? reject(new Error(`${command}: ${code}`)) : fulfill())
  );
}
