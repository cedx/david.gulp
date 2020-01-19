import { Checker } from './checker.js';
import { ConsoleReporter } from './reporter.js';
/**
 * Create a new checker.
 * @param options The checker options.
 * @return The newly created instance.
 */
export function david(options = {}) {
    const { error404 = false, errorDepCount = 0, errorDepType = false, errorSCM = false, ignore = [], registry = 'https://registry.npmjs.org/', reporter = true, unstable = false, update = false, verbose = false } = options;
    const checker = new Checker({
        ignore,
        registry: registry instanceof URL ? registry : new URL(registry),
        reporter: typeof reporter == 'boolean' ? (reporter ? new ConsoleReporter : undefined) : reporter,
        unstable,
        update: typeof update == 'boolean' ? (update ? '^' : '') : update,
        verbose
    });
    checker.error = {
        404: error404,
        depCount: Math.max(0, errorDepCount),
        depType: errorDepType,
        scm: errorSCM
    };
    return checker;
}
