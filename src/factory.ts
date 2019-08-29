import {Checker} from './checker';
import {ConsoleReporter, Reporter} from './reporter';

/**
 * Create a new checker.
 * @param options The checker options.
 * @return The newly created instance.
 */
export function david(options: Partial<DavidOptions> = {}): Checker {
  const {
    error404 = false,
    errorDepCount = 0,
    errorDepType = false,
    errorSCM = false,
    ignore = [],
    registry = 'https://registry.npmjs.org/',
    reporter = true,
    unstable = false,
    update = false,
    verbose = false
  } = options;

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

/** Defines the options of the [[david]] function. */
export interface DavidOptions {

  /** If a dependency is not found, emit an error. */
  error404: boolean;

  /** If greater than `0`, emit an error when the count of outdated dependencies equals or exceeds the specified value. */
  errorDepCount: number;

  /** If a dependency version is invalid (not a string), emit an error. */
  errorDepType: boolean;

  /** If a dependency version is a source control URL, emit an error. */
  errorSCM: boolean;

  /** The list of dependencies to ignore. */
  ignore: string[];

  /** The [npm](https://www.npmjs.com) registry URL. */
  registry: string|URL;

  /** The instance used to output the report. */
  reporter: boolean|Reporter;

  /** Value indicating whether to use unstable dependencies. */
  unstable: boolean;

  /** The operator to use in version comparators. */
  update: boolean|string;

  /** Value indicating whether to output the versions of all dependencies instead of only the outdated ones. */
  verbose: boolean;
}
