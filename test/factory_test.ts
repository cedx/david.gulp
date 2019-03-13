/* tslint:disable: no-unused-expression */
import {expect} from 'chai';
import {suite, test} from 'mocha-typescript';
import * as File from 'vinyl';
import {Checker, ConsoleReporter, david} from '../src';

/**
 * Tests the features of the factory function.
 */
@suite class FactoryTest {

  /**
   * Tests the `david()` function.
   */
  @test testDavid(): void {
    // It should return a `Checker` with a `ConsoleReporter`.
    let checker = david();
    expect(checker).to.be.an.instanceof(Checker);
    expect(checker.reporter).to.be.an.instanceof(ConsoleReporter);

    // It should properly initialize the instance properties.
    checker = david({
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
  }
}
