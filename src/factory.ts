import {Checker} from './checker';
import {ConsoleReporter, Reporter} from './reporter';

/**
 * Create a new checker.
 * @param options The checker options.
 * @return The newly created instance.
 */
export function david(options: DavidOptions = {}): Checker {
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
