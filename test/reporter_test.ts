import * as chai from 'chai';
import File from 'vinyl';
import {ConsoleReporter} from '../src/index';

/** Tests the features of the [[ConsoleReporter]] class. */
describe('ConsoleReporter', () => {
  const {expect} = chai;

  describe('#log()', () => {
    const file = new File({contents: Buffer.from('{"name": "@cedx/gulp-david"}'), path: '/foo.js'});
    file.david = {};

    it('should throw an error if the "david" property is not found on the file object', () => {
      expect(() => new ConsoleReporter().log(new File)).to.throw();
    });

    it('should output the file path', () => {
      const output = new ConsoleReporter().log(file, true);
      expect(output).to.contain(file.path);
    });

    it('should output "All dependencies up to date." if there is no outdated dependencies', () => {
      const output = new ConsoleReporter().log(file, true);
      expect(output).to.contain(file.path).and.contain('All dependencies up to date.');
    });

    it('should output the package names and versions if there is some outdated dependencies', () => {
      file.david = {
        dependencies: {
          foobar: {}
        }
      };

      const output = new ConsoleReporter().log(file, true);
      expect(output).to.contain('dependencies')
        .and.contain('foobar')
        .and.contain('required:')
        .and.contain('stable:')
        .and.contain('latest:');
    });
  });
});
