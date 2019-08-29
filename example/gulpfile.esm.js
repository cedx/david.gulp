import {david} from '@cedx/gulp-david';
import {exec} from 'child_process';
import gulp from 'gulp';

/** Checks the package dependencies, and emits an error if some of them are outdated. */
gulp.task('checkDependencies', () => gulp.src('package.json')
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
gulp.task('printDependencyReport', () => gulp.src('package.json')
  .pipe(david({verbose: true}))
);

/** Updates the package manifest using the tilde operator. */
gulp.task('updateManifest', () => gulp.src('package.json')
  .pipe(david({update: '~'}))
  .pipe(gulp.dest('.'))
);

/** Upgrades the packages to latest versions. */
gulp.task('upgradePackages:npmInstall', () => exec('npm install --ignore-scripts'));
gulp.task('upgradePackages:npmUpdate', () => exec('npm update --dev'));
gulp.task('upgradePackages', gulp.series('updateManifest', 'upgradePackages:npmInstall'));

/** Runs the default tasks. */
gulp.task('default', gulp.task('upgradePackages'));
