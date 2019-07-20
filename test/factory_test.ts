import chai from 'chai';
import File from 'vinyl';
import {Checker, ConsoleReporter, david} from '../lib/index.js';

/** Tests the features of the factory function. */
describe('Factory', () => {
  describe('david()', () => {
    it('should return a `Checker` with a `ConsoleReporter`', () => {
      const checker = david();
      expect(checker).to.be.an.instanceof(Checker);
      expect(checker.reporter).to.be.an.instanceof(ConsoleReporter);
    });

    it('should properly initialize the instance properties', () => {
      const checker = david({
        error404: true,
        errorDepCount: 123,
        errorDepType: true,
        errorSCM: true,
        ignore: ['@cedx/gulp-david'],
        registry: 'https://dev.belin.io/gulp-david',
        reporter: {log(file: File) { /* Noop */ }},
        unstable: true,
        update: '='
      });

      expect(checker.error).to.deep.equal({
        404: true,
        depCount: 123,
        depType: true,
        scm: true
      });

      expect(checker.ignore).to.include('@cedx/gulp-david');
      expect(checker.registry).to.be.instanceOf(URL).and.have.property('href').that.equal('https://dev.belin.io/gulp-david');
      expect(checker.reporter).to.be.an('object').and.have.property('log');
      expect(checker.unstable).to.be.true;
      expect(checker.update).to.equal('=');
    });
  });
});
