/**
 * Implementation of the `david.Reporter` class.
 * @module reporter
 */
'use strict';

// Module dependencies.
const chalk=require('chalk');
const pkg=require('../package.json');

/**
 * Prints the checker results to the standard output.
 */
class Reporter {

  /**
   * Logs the outdated dependencies provided by the specified file.
   * @param {vinyl.File} file The file providing the outdated dependencies.
   * @throws {Error} The dependencies were not found in the file.
   */
  log(file) {
    if(!('david' in file)) throw new Error(`[${pkg.name}] Dependencies not found.`);

    console.log(chalk.bold(file.path));
    let types=Object.keys(file.david).filter(type => Object.keys(file.david[type]).length>0);

    if(!types.length) console.log(chalk.green('  All dependencies up to date.'));
    else types.forEach(type => {
      console.log(type);

      let deps=file.david[type];
      for(let name in deps) {
        let dependency=deps[name];
        console.log(
          '  %s { required: %s, stable: %s, latest: %s }',
          chalk.magenta(name),
          chalk.red(dependency.required || '*'),
          chalk.green(dependency.stable || 'none'),
          chalk.yellow(dependency.latest)
        );
      }
    });
  }
}

// Public interface.
module.exports=Reporter;
