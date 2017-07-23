'use strict';

const chalk = require('chalk');
const {EOL} = require('os');
const {name: pkgName} = require('../package.json');

/**
 * Prints the checker results to the standard output.
 */
exports.Reporter = class Reporter {

  /**
   * Logs to the standard output the outdated dependencies provided by the specified file.
   * @param {File} file The file providing the outdated dependencies.
   * @throws {Error} The dependencies were not found in the file.
   */
  log(file) {
    if (!('david' in file)) throw new Error(`[${pkgName}] Dependencies not found.`);
    console.log(this._report(file));
  }

  /**
   * Builds the output of the outdated dependencies provided by the specified file.
   * @param {File} file The file providing the outdated dependencies.
   * @return {string} The output of the outdated dependencies.
   */
  _report(file) {
    let lines = [];
    lines.push(chalk.bold(file.path));

    let types = Object.keys(file.david).filter(type => Object.keys(file.david[type]).length > 0);
    if (!types.length) lines.push(chalk.green('  All dependencies up to date.'));
    else for (let type of types) {
      lines.push(type);

      let deps = file.david[type];
      for (let name in deps) {
        let dependency = deps[name];
        let requiredVersion = chalk.red(dependency.required || '*');
        let stableVersion = chalk.green(dependency.stable || '*');
        let latestVersion = chalk.yellow(dependency.latest || '*');
        lines.push(`  ${chalk.magenta(name)} { required: ${requiredVersion}, stable: ${stableVersion}, latest: ${latestVersion} }`);
      }
    }

    return lines.join(EOL);
  }
};
