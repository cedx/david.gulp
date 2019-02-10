/* tslint:disable: no-unused-expression */
import {expect} from 'chai';
import {suite, test} from 'mocha-typescript';
import * as File from 'vinyl';
import {ConsoleReporter} from '../src';

/**
 * Tests the features of the `ConsoleReporter` class.
 */
@suite class ConsoleReporterTest {

  /**
   * Tests the `ConsoleReporter#log` method.
   */
  @test testLog(): void {
    const file = new File({contents: Buffer.from('{"name": "@cedx/gulp-david"}'), path: '/foo.js'});
    file.david = {};

    // It should throw an error if the "david" property is not found on the file object.
    expect(() => (new ConsoleReporter).log(new File)).to.throw();

    // It should output the file path.
    let output = (new ConsoleReporter).log(file, true);
    expect(output).to.contain(file.path);

    // It should output "All dependencies up to date." if there is no outdated dependencies.
    output = (new ConsoleReporter).log(file, true);
    expect(output).to.contain(file.path).and.contain('All dependencies up to date.');

    // It should output the package names and versions if there is some outdated dependencies.
    file.david = {
      dependencies: {
        foobar: {}
      }
    };

    output = (new ConsoleReporter).log(file, true);
    expect(output).to.contain('dependencies')
      .and.contain('foobar')
      .and.contain('required:')
      .and.contain('stable:')
      .and.contain('latest:');
  }
}
