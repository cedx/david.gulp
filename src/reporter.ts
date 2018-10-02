/* tslint:disable: no-console */
import chalk from 'chalk';
import {EOL} from 'os';
import * as File from 'vinyl';
// @ts-ignore: disable processing of the imported JSON file.
import * as pkg from '../package.json';

/**
 * Defines the shape of a dependency reporter.
 */
export interface Reporter {

  /**
   * Logs the outdated dependencies provided by the specified file.
   * @param file The file providing the outdated dependencies.
   */
  log(file: File): void;
}

/**
 * Prints the checker results to the standard output.
 */
export class StdoutReporter implements Reporter {

  /**
   * The class name.
   */
  get [Symbol.toStringTag](): string {
    return 'Reporter';
  }

  /**
   * Logs to the standard output the outdated dependencies provided by the specified file.
   * @param file The file providing the outdated dependencies.
   * @throws {Error} The dependencies were not found in the file.
   */
  log(file: File): void {
    if (!('david' in file)) throw new Error(`[${pkg.name}] Dependencies not found.`);
    console.log(this._report(file));
  }

  /**
   * Builds the output of the outdated dependencies provided by the specified file.
   * @param file The file providing the outdated dependencies.
   * @return The output of the outdated dependencies.
   */
  private _report(file: File): string {
    const lines: string[] = [];
    lines.push(chalk.bold(file.path));

    const types = Object.keys(file.david).filter(type => Object.keys(file.david[type]).length > 0);
    if (!types.length) lines.push(chalk.green('  All dependencies up to date.'));
    else for (const type of types) {
      lines.push(type);

      const deps = file.david[type];
      for (const [name, dependency] of Object.entries(deps)) {
        const requiredVersion = chalk.red(dependency.required || '*');
        const stableVersion = chalk.green(dependency.stable || '*');
        const latestVersion = chalk.yellow(dependency.latest || '*');
        lines.push(`  ${chalk.magenta(name)} { required: ${requiredVersion}, stable: ${stableVersion}, latest: ${latestVersion} }`);
      }
    }

    return lines.join(EOL);
  }
}