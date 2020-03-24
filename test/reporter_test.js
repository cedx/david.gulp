import {strict as assert} from 'assert';
import File from 'vinyl';
import {ConsoleReporter} from '../lib/index.js';

/** Tests the features of the {@link ConsoleReporter} class. */
describe('ConsoleReporter', () => {
  describe('.log()', () => {
    const file = new File({contents: Buffer.from('{"name": "@cedx/gulp-david"}'), path: '/foo.js'});
    file.david = {};

    it('should throw an error if the "david" property is not found on the file object', () => {
      assert.throws(() => new ConsoleReporter().log(new File));
    });

    it('should output the file path', () => {
      const output = new ConsoleReporter().log(file, true);
      assert(output.includes(file.path));
    });

    it('should output "All dependencies up to date." if there is no outdated dependencies', () => {
      const output = new ConsoleReporter().log(file, true);
      assert(output.includes(file.path));
      assert(output.includes('All dependencies up to date.'));
    });

    it('should output the package names and versions if there is some outdated dependencies', () => {
      file.david = {
        dependencies: {
          foobar: {}
        }
      };

      const output = new ConsoleReporter().log(file, true);
      assert(output.includes('dependencies'));
      assert(output.includes('foobar'));
      assert(output.includes('required:'));
      assert(output.includes('stable:'));
      assert(output.includes('latest:'));
    });
  });
});
