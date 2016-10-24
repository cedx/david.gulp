import assert from 'assert';
import File from 'vinyl';
import {Reporter} from '../lib/reporter';

/**
 * @test {Reporter}
 */
describe('Reporter', () => {

  /**
   * @test {Reporter#log}
   */
  describe('#log()', () => {
    it('should throw an error if "david" property is not found on the file object', () => {
      assert.throws(() => new Reporter().log(new File()), Error);
    });
  });

  /**
   * @test {Reporter#_report}
   */
  describe('#_report()', () => {
    let file = new File({contents: Buffer.from('{"name": "@cedx/gulp-david"}'), path: '/foo.js'});
    file.david = {};

    it('should output the file path', () => {
      let output = new Reporter()._report(file);
      assert(output.includes(file.path));
    });

    it('should output "All dependencies up to date." if there is no outdated dependencies', () => {
      let output = new Reporter()._report(file);
      assert(output.includes(file.path));
      assert(output.includes('All dependencies up to date.'));
    });

    it('should output the package names and versions if there is some outdated dependencies', () => {
      file.david = {
        dependencies: {
          foobar: {}
        }
      };

      let output = new Reporter()._report(file);
      assert(output.includes('dependencies'));
      assert(output.includes('foobar'));
      assert(output.includes('required:'));
      assert(output.includes('stable:'));
      assert(output.includes('latest:'));
    });
  });
});
