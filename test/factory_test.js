'use strict';

const {expect} = require('chai');
const {URL} = require('url');
const {Checker, factory, Reporter} = require('../lib');

/**
 * @test {factory}
 */
describe('factory()', () => {
  it('should return a `Checker` with a `Reporter`', () => {
    let checker = factory();
    expect(checker).to.be.instanceof(Checker);
    expect(checker.reporter).to.be.instanceof(Reporter);
  });

  it('should properly initialize the checker properties', () => {
    let checker = factory({
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

    expect(checker.ignore).to.include('@cedx/gulp-david');
    expect(checker.registry).to.be.instanceOf(URL).and.have.property('href').that.equal('https://github.com/cedx/gulp-david');
    expect(checker.reporter).to.be.an('object').and.have.property('foo');
    expect(checker.unstable).to.be.true;
    expect(checker.update).to.equal('=');
  });
});
