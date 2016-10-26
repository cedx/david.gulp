import {Checker} from './checker';

/**
 * Create a new instance of the plug-in.
 * @param {object} options The plug-in options.
 * @return {Checker} Tthe newly created instance.
 */
export function david(options) {
  return new Checker(options);
}
