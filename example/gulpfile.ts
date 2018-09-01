/* tslint:disable: no-console */

// @ts-ignore
import {david} from '@cedx/gulp-david';
import {spawn, SpawnOptions} from 'child_process';
import * as gulp from 'gulp';
import {normalize} from 'path';

/**
 * Checks the package dependencies, and emits an error if some of them are outdated.
 */
gulp.task('checkDependencies', () => gulp.src('package.json')
  .pipe(david({
    error404: true,
    errorDepCount: 1,
    errorDepType: true
  }))
  .on('error', function(this: NodeJS.ReadWriteStream, err: Error) {
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
gulp.task('upgradePackages:npmInstall', () => _exec('npm', ['install', '--ignore-scripts']));
gulp.task('upgradePackages:npmUpdate', () => _exec('npm', ['update', '--dev']));
gulp.task('upgradePackages', gulp.series('updateManifest', 'upgradePackages:npmInstall'));

/**
 * Runs the default tasks.
 */
gulp.task('default', gulp.task('upgradePackages'));

/**
 * Spawns a new process using the specified command.
 * @param command The command to run.
 * @param args The command arguments.
 * @param options The settings to customize how the process is spawned.
 * @return Completes when the command is finally terminated.
 */
function _exec(command: string, args: string[] = [], options: SpawnOptions = {}): Promise<void> {
  return new Promise((fulfill, reject) => spawn(normalize(command), args, Object.assign({shell: true, stdio: 'inherit'}, options))
    .on('close', code => code ? reject(new Error(`${command}: ${code}`)) : fulfill())
  );
}
