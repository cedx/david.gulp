import {Checker} from './checker';

export * from './checker';
export * from './reporter';

/**
 * Create a new instance of the plug-in.
 * @param {object} [options] The plug-in options.
 * @return {Checker} The newly created instance.
 */
export function david(options = {}) {
  return new Checker(options);
}
