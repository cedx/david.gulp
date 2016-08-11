/**
 * Unit tests of the `reporter` module.
 * @module test/reporter_test
 */
const assert = require('assert');
const File = require('vinyl');
const Reporter = require('../lib/reporter');

/**
 * Tests the features of the `david.Reporter` class.
 */
class ReporterTest {

  /**
   * Runs the unit tests.
   */
  run() {
    describe('Reporter', () => {
      describe('log()', this.testLog);
      describe('_report()', this.testReport);
    });
  }

  /**
   * Tests the `log` method.
   */
  testLog() {
    it('should throw an error if "david" property is not found on the file object', () => {
      assert.throws(() => new Reporter().log(new File()), Error);
    });
  }

  /**
   * Tests the `_report` method.
   */
  testReport() {
    let file = new File({contents: Buffer.from('{"name": "@cedx/gulp-david"}'), path: '/foo.js'});
    file.david = {};

    it('should output the file path', () => {
      let output = new Reporter()._report(file);
      assert(output.indexOf(file.path) >= 0);
    });

    it('should output "All dependencies up to date." if there is no outdated dependencies', () => {
      let output = new Reporter()._report(file);
      assert(output.indexOf(file.path) >= 0);
      assert(output.indexOf('All dependencies up to date.') >= 0);
    });

    it('should output the package names and versions if there is some outdated dependencies', () => {
      file.david = {
        dependencies: {
          foobar: {}
        }
      };

      let output = new Reporter()._report(file);
      assert(output.indexOf('dependencies') >= 0);
      assert(output.indexOf('foobar') >= 0);
      assert(output.indexOf('required:') >= 0);
      assert(output.indexOf('stable:') >= 0);
      assert(output.indexOf('latest:') >= 0);
    });
  }
}

// Run all tests.
new ReporterTest().run();
