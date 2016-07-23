/**
 * Unit tests of the `checker` module.
 * @module test/checker_test
 */
const assert = require('assert');
const Checker = require('../lib/checker');
const File = require('vinyl');
const pkg = require('../package.json');
const stream = require('stream');

/**
 * Tests the features of the `david.Checker` class.
 */
class CheckerTest {

  /**
   * Runs the unit tests.
   */
  run() {
    let self = this;
    describe('Checker', function() {
      this.timeout(10000);
      describe('constructor()', self.testConstructor);
      describe('parseManifest()', self.testParseManifest);
      describe('getDependencies()', self.testGetDependencies);
      describe('getUpdatedDependencies()', self.testGetUpdatedDependencies);
      describe('_transform()', self.testTransform);
    });
  }

  /**
   * Tests the constructor.
   */
  testConstructor() {
    it('should properly handle the options', () =>
      assert.equal(new Checker({errorDepCount: 5, reporter: false})._options.errorDepCount, 5)
    );

    it('should have a reporter if property is not false', () =>
      assert(typeof new Checker({reporter: {}})._options.reporter == 'object')
    );
  }

  /**
   * Tests the `getDependencies` method.
   */
  testGetDependencies() {
    it('should return a Promise object', () =>
      assert(new Checker({reporter: false}).getDependencies({}) instanceof Promise)
    );

    it('should return an object with 3 dependency properties', () =>
      new Checker({reporter: false}).getDependencies({name: '@cedx/gulp-david'}).then(deps => {
        assert('dependencies' in deps);
        assert('devDependencies' in deps);
        assert('optionalDependencies' in deps);
      })
    );

    it('should have some non-empty dependency properties for the current manifest', () =>
      new Checker({reporter: false}).getDependencies(pkg).then(deps => {
        assert(Object.keys(deps.dependencies).length > 0);
        assert(Object.keys(deps.devDependencies).length > 0);
        assert(!Object.keys(deps.optionalDependencies).length);
      })
    );
  }

  /**
   * Tests the `getUpdatedDependencies` method.
   */
  testGetUpdatedDependencies() {
    it('should return a Promise object', () =>
      assert(new Checker({reporter: false}).getUpdatedDependencies({}) instanceof Promise)
    );

    it('should return an object with 3 dependency properties', () =>
      new Checker({reporter: false}).getUpdatedDependencies({name: '@cedx/gulp-david'}).then(deps => {
        assert('dependencies' in deps);
        assert('devDependencies' in deps);
        assert('optionalDependencies' in deps);
      })
    );

    it('should have some empty dependency properties for the current manifest', () =>
      new Checker({reporter: false}).getUpdatedDependencies(pkg).then(deps => {
        assert(!Object.keys(deps.optionalDependencies).length);
      })
    );
  }

  /**
   * Tests the `parseManifest` method.
   */
  testParseManifest() {
    it('should throw an error if file is null', () =>
      assert.throws(() => new Checker({reporter: false}).parseManifest(new File()))
    );

    it('should throw an error if file is a stream', () =>
      assert.throws(() => {
        let file = new File({contents: new stream.Readable()});
        new Checker({reporter: false}).parseManifest(file);
      })
    );

    it('should throw an error if manifest is invalid', () =>
      assert.throws(() => {
        let file = new File({contents: new Buffer('FooBar')});
        new Checker({reporter: false}).parseManifest(file);
      })
    );

    it('should return an object if manifest is valid', () => {
      let file = new File({contents: new Buffer('{"name": "@cedx/gulp-david"}')});
      assert.deepEqual(new Checker({reporter: false}).parseManifest(file), {name: '@cedx/gulp-david'});
    });
  }

  /**
   * Tests the `_transform` method.
   */
  testTransform() {
    it('should return an error if manifest is invalid', done => {
      let src = new File({contents: new Buffer('FooBar')});
      new Checker({reporter: false})._transform(src, 'utf8', (err, dest) => {
        assert(err instanceof Error);
        assert(typeof dest == 'undefined');
        done();
      });
    });

    it('should add a "david" property to the file object', done => {
      let src = new File({contents: new Buffer('{"name": "@cedx/gulp-david"}')});
      new Checker({reporter: false})._transform(src, 'utf8', (err, dest) => {
        assert.ifError(err);
        assert('david' in dest);
        done();
      });
    });
  }
}

// Run all tests.
new CheckerTest().run();
