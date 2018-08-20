import {expect} from 'chai';
const File from 'vinyl');
const {Reporter} from '../lib';

/**
 * Tests the `Reporter}
 */
describe('Reporter', () => {

  /**
   * Tests the `Reporter#log}
   */
  describe('#log()', () => {
    it('should throw an error if the "david" property is not found on the file object', () => {
      expect(() => (new Reporter).log(new File)).to.throw();
    });
  });

  /**
   * Tests the `Reporter#_report}
   */
  describe('#_report()', () => {
    let file = new File({contents: Buffer.from('{"name": "@cedx/gulp-david"}'), path: '/foo.js'});
    file.david = {};

    it('should output the file path', () => {
      let output = (new Reporter)._report(file);
      expect(output).to.contain(file.path);
    });

    it('should output "All dependencies up to date." if there is no outdated dependencies', () => {
      let output = (new Reporter)._report(file);
      expect(output).to.contain(file.path);
      expect(output).to.contain('All dependencies up to date.');
    });

    it('should output the package names and versions if there is some outdated dependencies', () => {
      file.david = {
        dependencies: {
          foobar: {}
        }
      };

      let output = (new Reporter)._report(file);
      expect(output).to.contain('dependencies')
        .and.contain('foobar')
        .and.contain('required:')
        .and.contain('stable:')
        .and.contain('latest:');
    });
  });
});
