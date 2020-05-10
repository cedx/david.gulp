import chalk from 'chalk';
import { EOL } from 'os';
/** Prints the checker results to the standard output. */
export class ConsoleReporter {
    /**
     * Logs to the standard output the outdated dependencies provided by the specified file.
     * @param file The file providing the outdated dependencies.
     * @param returnOutput Value indicating whether to return the output of the outdated dependencies, rather than print it.
     * @return The output of the outdated dependencies.
     * @throws `Error` The dependencies were not found in the file.
     */
    log(file, returnOutput = false) {
        if (!('david' in file))
            throw new Error('[@cedx/david] Dependencies not found.');
        const report = this._report(file);
        if (returnOutput)
            return report;
        console.log(report); // eslint-disable-line no-console
        return undefined;
    }
    /**
     * Builds the output of the outdated dependencies provided by the specified file.
     * @param file The file providing the outdated dependencies.
     * @return The output of the outdated dependencies.
     */
    _report(file) {
        const lines = [];
        lines.push(chalk.bold(file.path ? file.path : 'package.json'));
        const types = Object.keys(file.david).filter(type => Object.keys(file.david[type]).length > 0);
        if (!types.length)
            lines.push(chalk.green('  All dependencies up to date.'));
        else
            for (const type of types) {
                lines.push(type);
                for (const [name, dependency] of Object.entries(file.david[type])) {
                    const requiredVersion = chalk.red(dependency.required ?? '*');
                    const stableVersion = chalk.green(dependency.stable ?? '*');
                    const latestVersion = chalk.yellow(dependency.latest ?? '*');
                    lines.push(`  ${chalk.magenta(name)} { required: ${requiredVersion}, stable: ${stableVersion}, latest: ${latestVersion} }`);
                }
            }
        return lines.join(EOL);
    }
}
