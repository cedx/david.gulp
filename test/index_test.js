'use strict';

import {expect} from 'chai';
import {david, Checker, Reporter} from '../src/index';

/**
 * @test {david}
 */
describe('david()', () => {
  it('should return a `Checker` with a `Reporter`', () => {
    let checker = david();
    expect(checker).to.be.instanceof(Checker);
    expect(checker.reporter).to.be.instanceof(Reporter);
  });

  it('should properly initialize the checker properties', () => {
    let checker = david({
      error404: true,
      errorDepCount: 123,
      errorDepType: true,
      errorSCM: true,
      ignore: ['@cedx/gulp-david'],
      registry: 'https://github.com/cedx/gulp-david',
      reporter: {foo: 'bar'},
      unstable: true,
      update: '='
    });

    expect(checker.error).to.deep.equal({
      404: true,
      depCount: 123,
      depType: true,
      scm: true
    });

    expect(checker.ignore).to.have.members(['@cedx/gulp-david']);
    expect(checker.registry).to.equal('https://github.com/cedx/gulp-david');
    expect(checker.reporter).to.be.an('object').and.have.keys('foo');
    expect(checker.unstable).to.be.true;
    expect(checker.update).to.equal('=');
  });
});
