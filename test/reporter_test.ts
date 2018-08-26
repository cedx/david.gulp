/* tslint:disable: no-unused-expression */
import {expect} from 'chai';
import {suite, test} from 'mocha-typescript';
import * as File from 'vinyl';
import {Reporter} from '../src';

/**
 * Tests the features of the `Reporter` class.
 */
@suite class ReporterTest {

  /**
   * Tests the `Reporter#log}
   */
  @test testLog(): void {
    // It should throw an error if the "david" property is not found on the file object.
    expect(() => (new Reporter).log(new File)).to.throw();
  }

  /**
   * Tests the `Reporter#_report}
   */
  @test testReport(): void {
    const file = new File({contents: Buffer.from('{"name": "@cedx/gulp-david"}'), path: '/foo.js'});
    file.david = {};

    // It should output the file path.
    let output = (new Reporter)._report(file);
    expect(output).to.contain(file.path);

    // It should output "All dependencies up to date." if there is no outdated dependencies.
    output = (new Reporter)._report(file);
    expect(output).to.contain(file.path);
    expect(output).to.contain('All dependencies up to date.');

    // It should output the package names and versions if there is some outdated dependencies.
    file.david = {
      dependencies: {
        foobar: {}
      }
    };

    output = (new Reporter)._report(file);
    expect(output).to.contain('dependencies')
      .and.contain('foobar')
      .and.contain('required:')
      .and.contain('stable:')
      .and.contain('latest:');
  }
}
