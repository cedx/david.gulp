/* tslint:disable: no-unused-expression */
import {expect} from 'chai';
import {suite, test} from 'mocha-typescript';
import {Checker, david, Reporter} from '../src';

/**
 * Tests the features of the factory function.
 */
@suite class FactoryTest {

  /**
   * Tests the `david()` function.
   */
  @test testDavid(): void {
    // It should return a `Checker` with a `Reporter`.
    let checker = david();
    expect(checker).to.be.instanceof(Checker);
    expect(checker.reporter).to.be.instanceof(Reporter);

    // It should properly initialize the instance properties.
    checker = david({
      error404: true,
      errorDepCount: 123,
      errorDepType: true,
      errorSCM: true,
      ignore: ['@cedx/gulp-david'],
      registry: 'https://dev.belin.io/gulp-david',
      reporter: {
        [Symbol.toStringTag]: 'Reporter',
        log(_: File) {}
      },
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
    expect(checker.reporter).to.be.an('object').and.have.property('foo');
    expect(checker.unstable).to.be.true;
    expect(checker.update).to.equal('=');
  }
}
