'use strict';

const {expect} = require('chai');
const {Readable} = require('stream');
const {URL} = require('url');
const File = require('vinyl');

const pkg = require('../package.json');
const {Checker, Reporter} = require('../lib');

/**
 * @test {Checker}
 */
describe('Checker', function() {
  this.timeout(15000);

  /**
   * @test {Checker.factory}
   */
  describe('.factory()', () => {
    it('should return a `Checker` with a `Reporter`', () => {
      let checker = Checker.factory();
      expect(checker).to.be.instanceof(Checker);
      expect(checker.reporter).to.be.instanceof(Reporter);
    });

    it('should properly initialize the instance properties', () => {
      let checker = Checker.factory({
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

  /**
   * @test {Checker#getDependencies}
   */
  describe('#getDependencies()', () => {
    it('should return an object with 3 dependency properties', done => {
      (new Checker).getDependencies({name: '@cedx/gulp-david'}).subscribe(deps => {
        expect(deps).to.contain.all.keys('dependencies', 'devDependencies', 'optionalDependencies');
      }, done, done);
    });

    it('should have some non-empty dependency properties for the current manifest', done => {
      (new Checker).getDependencies(pkg).subscribe(deps => {
        expect(Object.keys(deps.dependencies)).to.not.be.empty;
        expect(Object.keys(deps.devDependencies)).to.not.be.empty;
        expect(Object.keys(deps.optionalDependencies)).to.be.empty;
      }, done, done);
    });
  });

  /**
   * @test {Checker#getUpdatedDependencies}
   */
  describe('#getUpdatedDependencies()', () => {
    it('should return an object with 3 dependency properties', done => {
      (new Checker).getUpdatedDependencies({name: '@cedx/gulp-david'}).subscribe(deps => {
        expect(deps).to.contain.all.keys('dependencies', 'devDependencies', 'optionalDependencies');
      }, done, done);
    });

    it('should have some empty dependency properties for the current manifest', done => {
      (new Checker).getUpdatedDependencies(pkg).subscribe(deps => {
        expect(Object.keys(deps.optionalDependencies)).to.be.empty;
      }, done, done);
    });
  });

  /**
   * @test {Checker#parseManifest}
   */
  describe('#parseManifest()', () => {
    it('should throw an error if the file is null', () => {
      expect(() => (new Checker).parseManifest(new File)).to.throw();
    });

    it('should throw an error if the file is a stream', () => {
      expect(() => (new Checker).parseManifest(new File({contents: new Readable}))).to.throw();
    });

    it('should throw an error if the manifest is invalid', () => {
      expect(() => (new Checker).parseManifest(new File({contents: Buffer.from('FooBar')}))).to.throw();
    });

    it('should return an object if the manifest is valid', () => {
      let file = new File({contents: Buffer.from('{"name": "@cedx/gulp-david"}')});
      expect((new Checker).parseManifest(file)).to.deep.equal({name: '@cedx/gulp-david'});
    });
  });

  /**
   * @test {Checker#_transform}
   */
  describe('#_transform()', () => {
    it('should throw an error if the manifest is invalid', done => {
      let input = new File({contents: Buffer.from('FooBar')});
      (new Checker)._transform(input, 'utf8', err => {
        expect(err).to.be.instanceof(Error);
        done();
      });
    });

    it('should add a "david" property to the file object', done => {
      let input = new File({contents: Buffer.from('{"name": "@cedx/gulp-david"}')});
      (new Checker)._transform(input, 'utf8', (err, file) => {
        if (err) done(err);
        else {
          expect(file).to.have.property('david').that.is.an('object');
          done();
        }
      });
    });
  });
});
