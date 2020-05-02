import {strict as assert} from 'assert';
import {Checker, ConsoleReporter, david} from '../lib/index.js';

/** Tests the features of the `david()` function. */
describe('Factory', () => {
  describe('david()', () => {
    it('should return a `Checker` with a `ConsoleReporter`', () => {
      const checker = david();
      assert(checker instanceof Checker);
      assert(checker.reporter instanceof ConsoleReporter);
    });

    it('should properly initialize the instance properties', () => {
      const checker = david({
        error404: true,
        errorDepCount: 123,
        errorDepType: true,
        errorSCM: true,
        ignore: ['@cedx/gulp-david'],
        registry: 'https://docs.belin.io/gulp-david',
        reporter: {log() { /* Noop */ }},
        unstable: true,
        update: '='
      });

      assert.deepEqual(checker.error, {
        404: true,
        depCount: 123,
        depType: true,
        scm: true
      });

      assert(checker.ignore.includes('@cedx/gulp-david'));
      assert(checker.registry instanceof URL);
      assert.equal(checker.registry.href, 'https://docs.belin.io/gulp-david');
      assert.ok(checker.reporter);
      assert.equal(typeof checker.reporter.log, 'function');
      assert(checker.unstable);
      assert.equal(checker.update, '=');
    });
  });
});
