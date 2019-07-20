import {david} from '@cedx/gulp-david';
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
task('upgradePackages:npmInstall', () => _exec('npm', ['install']));
task('upgradePackages:npmUpdate', () => _exec('npm', ['update', '--dev']));
task('upgradePackages', series('updateManifest', 'upgradePackages:npmInstall'));

/** Runs the default tasks. */
task('default', task('upgradePackages'));

/**
 * Spawns a new process using the specified command.
 * @param {string} command The command to run.
 * @param {string[]} [args] The command arguments.
 * @param {SpawnOptions} [options] The settings to customize how the process is spawned.
 * @return {Promise} Completes when the command is finally terminated.
 */
function _exec(command, args = [], options = {}) {
  return new Promise((fulfill, reject) => spawn(normalize(command), args, {shell: true, stdio: 'inherit', ...options})
    .on('close', code => code ? reject(new Error(`${command}: ${code}`)) : fulfill())
  );
}

/**
 * @typedef {object} SpawnOptions
 * @property {string} [argv0] Explicitly set the value of `argv[0]` sent to the child process.
 * @property {string} [cwd] Current working directory of the child process.
 * @property {boolean} [detached] Prepare child to run independently of its parent process.
 * @property {Object<string, string>} [env] Environment key-value pairs.
 * @property {number} [gid] Sets the group identity of the process.
 * @property {boolean|string} [shell] If `true`, runs command inside of a shell. A different shell can be specified as a string.
 * @property {Array|string} [stdio] Child's stdio configuration.
 * @property {number} [timeout] In milliseconds the maximum amount of time the process is allowed to run.
 * @property {number} [uid] Sets the user identity of the process.
 * @property {boolean} [windowsHide] Hide the subprocess console window that would normally be created on Windows systems.
 * @property {boolean} [windowsVerbatimArguments] No quoting or escaping of arguments is done on Windows.
 */
