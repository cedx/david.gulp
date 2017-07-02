import {URL} from 'url';
import {Checker} from './checker';
import {Reporter} from './reporter';

export * from './checker';
export * from './reporter';

/**
 * Create a new instance of the plug-in.
 * @param {object} [options] The plug-in options.
 * @return {Checker} The newly created instance.
 */
export function david(options = {}) {
  let checker = new Checker(new Reporter);

  if (typeof options.error404 == 'boolean') checker.error['404'] = options.error404;
  if (Number.isInteger(options.errorDepCount)) checker.error.depCount = options.errorDepCount;
  if (typeof options.errorDepType == 'boolean') checker.error.depType = options.errorDepType;
  if (typeof options.errorSCM == 'boolean') checker.error.scm = options.errorSCM;
  if (Array.isArray(options.ignore)) checker.ignore = options.ignore;
  if (typeof options.registry == 'string') checker.registry = new URL(options.registry);
  if (typeof options.unstable == 'boolean') checker.unstable = options.unstable;
  if (typeof options.verbose == 'boolean') checker.verbose = options.verbose;

  if (typeof options.reporter == 'boolean' && !options.reporter) checker.reporter = null;
  else if (typeof options.reporter == 'object' && options.reporter) checker.reporter = options.reporter;

  if (typeof options.update == 'boolean' && options.update) checker.update = '^';
  else if (typeof options.update == 'string') checker.update = options.update;

  return checker;
}
