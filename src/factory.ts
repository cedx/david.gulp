import {Checker} from './checker';
import {ConsoleReporter, Reporter} from './reporter';

/**
 * Create a new checker.
 * @param options The checker options.
 * @return The newly created instance.
 */
export function david(options: Partial<DavidOptions> = {}): Checker {
  const checker = new Checker({
    ignore: Array.isArray(options.ignore) ? options.ignore : [],
    registry: new URL(typeof options.registry == 'string' && options.registry.length ? options.registry : 'https://registry.npmjs.org/'),
    reporter: typeof options.reporter == 'object' && options.reporter ? options.reporter : new ConsoleReporter,
    unstable: typeof options.unstable == 'boolean' ? options.unstable : false,
    update: typeof options.update == 'string' ? options.update : '',
    verbose: typeof options.verbose == 'boolean' ? options.verbose : false
  });

  checker.error = {
    404: typeof options.error404 == 'boolean' ? options.error404 : false,
    depCount: typeof options.errorDepCount == 'number' ? Math.max(0, options.errorDepCount) : 0,
    depType: typeof options.errorDepType == 'boolean' ? options.errorDepType : false,
    scm: typeof options.errorSCM == 'boolean' ? options.errorSCM : false
  };

  if (typeof options.reporter == 'boolean' && !options.reporter) checker.reporter = null;
  if (typeof options.update == 'boolean' && options.update) checker.update = '^';
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
