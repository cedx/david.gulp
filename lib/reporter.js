/**
 * Implementation of the `david.Reporter` class.
 * @module reporter
 */
'use strict';

// Module dependencies.
const chalk=require('chalk');
const pkg=require('../package.json');
const Transform=require('stream').Transform;
const util=require('util');

/**
 * Prints the checker results to the standard output.
 * @class david.Reporter
 * @extends stream.Transform
 * @constructor
 */
function Reporter() {
  Transform.call(this, { objectMode: true });
}

// Prototype chain.
util.inherits(Reporter, Transform);

/**
 * Transforms input and produces output.
 * @method _transform
 * @param {vinyl.File} file The chunk to be transformed.
 * @param {String} encoding The encoding type if the chunk is a string.
 * @param {Function} callback The function to invoke when the supplied chunk has been processed.
 * @async
 * @private
 */
Reporter.prototype._transform=function(file, encoding, callback) {
  if(!('david' in file)) {
    callback(new Error(util.format('[%s] Dependencies not found.', pkg.name)));
    return;
  }

  let types=Object.keys(file.david).filter(function(type) {
    return Object.keys(file.david[type]).length>0;
  });

  console.log(chalk.bold(file.path));
  if(!types.length) console.log(chalk.green('  All dependencies up to date.'));
  else types.forEach(function(type) {
    console.log(type);

    let deps=file.david[type];
    for(let name in deps) {
      let dependency=deps[name];
      console.log(
        '  %s { required: %s, stable: %s, latest: %s }',
        chalk.magenta(name),
        chalk.red(dependency.required),
        chalk.green(dependency.stable),
        chalk.yellow(dependency.latest)
      );
    }
  });

  callback(null, file);
};

// Public interface.
module.exports=Reporter;
