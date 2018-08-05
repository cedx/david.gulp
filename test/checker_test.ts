const {expect} = require('chai');
const {Readable} = require('stream');
const File = require('vinyl');

const pkg = require('../package.json');
const {Checker, Reporter} = require('../lib/index.js');

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
        registry: 'https://dev.belin.io/gulp-david',
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
      expect(checker.registry).to.be.instanceOf(URL).and.have.property('href').that.equal('https://dev.belin.io/gulp-david');
      expect(checker.reporter).to.be.an('object').and.have.property('foo');
      expect(checker.unstable).to.be.true;
      expect(checker.update).to.equal('=');
    });
  });

  /**
   * @test {Checker#getDependencies}
   */
  describe('#getDependencies()', () => {
    it('should return an object with 3 dependency properties', async () => {
      let deps = await (new Checker).getDependencies({name: '@cedx/gulp-david'});
      expect(deps).to.contain.all.keys('dependencies', 'devDependencies', 'optionalDependencies');
    });

    it('should have some non-empty dependency properties for the current manifest', async () => {
      let deps = await (new Checker).getDependencies(pkg);
      expect(Object.keys(deps.dependencies)).to.not.be.empty;
      expect(Object.keys(deps.devDependencies)).to.not.be.empty;
      expect(Object.keys(deps.optionalDependencies)).to.be.empty;
    });
  });

  /**
   * @test {Checker#getUpdatedDependencies}
   */
  describe('#getUpdatedDependencies()', () => {
    it('should return an object with 3 dependency properties', async () => {
      let deps = await (new Checker).getUpdatedDependencies({name: '@cedx/gulp-david'});
      expect(deps).to.contain.all.keys('dependencies', 'devDependencies', 'optionalDependencies');
    });

    it('should have some empty dependency properties for the current manifest', async () => {
      let deps = await (new Checker).getUpdatedDependencies(pkg);
      expect(Object.keys(deps.optionalDependencies)).to.be.empty;
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
    it('should throw an error if the manifest is invalid', async () => {
      try {
        let input = new File({contents: Buffer.from('FooBar')});
        await (new Checker)._transform(input);
        expect(true).to.not.be.ok;
      }

      catch (err) {
        expect(err).to.be.instanceof(Error);
      }
    });

    it('should add a "david" property to the file object', async () => {
      let input = new File({contents: Buffer.from('{"name": "@cedx/gulp-david"}')});
      let file = await (new Checker)._transform(input);
      expect(file).to.have.property('david').that.is.an('object');
    });
  });
});
