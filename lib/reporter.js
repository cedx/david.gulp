/**
 * Implementation of the `david.Reporter` class.
 * @module reporter
 */
'use strict';

// Module dependencies.
const chalk=require('chalk');
const pkg=require('../package.json');
const Transform=require('stream').Transform;

/**
 * Prints the checker results to the standard output.
 * @extends stream.Transform
 */
class Reporter extends Transform {

  /**
   * Initializes a new instance of the class.
   */
  constructor() {
    super({ objectMode: true });
  }

  /**
   * Transforms input and produces output.
   * @param {vinyl.File} file The chunk to be transformed.
   * @param {string} encoding The encoding type if the chunk is a string.
   * @param {function} callback The function to invoke when the supplied chunk has been processed.
   * @private
   */
  _transform(file, encoding, callback) {
    if(!('david' in file)) {
      callback(new Error(`[${pkg.name}] Dependencies not found.`));
      return;
    }

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

    callback(null, file);
  }
}

// Public interface.
module.exports=Reporter;
