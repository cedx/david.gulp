/**
 * Unit tests of the `checker` module.
 * @module test.checker_test
 */
'use strict';

// Module dependencies.
const assert=require('assert');
const Checker=require('../lib/checker');
const File=require('vinyl');
const pkg=require('../package.json');
const stream=require('stream');

/**
 * Tests the features of the `david.Checker` class.
 * @class david.tests.CheckerTest
 * @static
 */
const CheckerTest={

  /**
   * Runs the unit tests.
   * @method run
   */
  run: function() {
    let self=this;
    describe('Checker', function() {
      this.timeout(10000);
      describe('parseManifest()', self.testParseManifest);
      describe('getDependencies()', self.testGetDependencies);
      describe('getUpdatedDependencies()', self.testGetUpdatedDependencies);
      describe('_transform()', self.testTransform);
    });
  },

  /**
   * Tests the `getDependencies` method.
   * @method testGetDependencies
   */
  testGetDependencies: function() {
    it('should return a Promise object', function() {
      assert(new Checker().getDependencies() instanceof Promise);
    });

    it('should return an object with 3 dependency properties', function() {
      return new Checker().getDependencies({ name: 'gulp-david' }).then(function(deps) {
        assert('dependencies' in deps);
        assert('devDependencies' in deps);
        assert('optionalDependencies' in deps);
      });
    });

    it('should have some non-empty dependency properties for the current manifest', function() {
      return new Checker().getDependencies(pkg).then(function(deps) {
        assert(Object.keys(deps.dependencies).length>0);
        assert(Object.keys(deps.devDependencies).length>0);
        assert(!Object.keys(deps.optionalDependencies).length);
      });
    });
  },

  /**
   * Tests the `getUpdatedDependencies` method.
   * @method testGetUpdatedDependencies
   */
  testGetUpdatedDependencies: function() {
    it('should return a Promise object', function() {
      assert(new Checker().getUpdatedDependencies() instanceof Promise);
    });

    it('should return an object with 3 dependency properties', function() {
      return new Checker().getUpdatedDependencies({ name: 'gulp-david' }).then(function(deps) {
        assert('dependencies' in deps);
        assert('devDependencies' in deps);
        assert('optionalDependencies' in deps);
      });
    });

    it('should have some empty dependency properties for the current manifest', function() {
      return new Checker().getUpdatedDependencies(pkg).then(function(deps) {
        assert(!Object.keys(deps.optionalDependencies).length);
      });
    });
  },

  /**
   * Tests the `parseManifest` method.
   * @method testParseManifest
   */
  testParseManifest: function() {
    it('should throw an error if file is null', function() {
      assert.throws(function() {
        new Checker().parseManifest(new File());
      });
    });

    it('should throw an error if file is a stream', function() {
      assert.throws(function() {
        let file=new File({ contents: new stream.Readable() });
        new Checker().parseManifest(file);
      });
    });

    it('should throw an error if manifest is invalid', function() {
      assert.throws(function() {
        let file=new File({ contents: new Buffer('FooBar') });
        new Checker().parseManifest(file);
      });
    });

    it('should return an object if manifest is valid', function() {
      let file=new File({ contents: new Buffer('{ "name": "gulp-david" }') });
      assert.deepEqual(new Checker().parseManifest(file), { name: 'gulp-david' });
    });
  },

  /**
   * Tests the `_transform` method.
   * @method testTransform
   */
  testTransform: function() {
    it('should add a "david" property to the file object', function(done) {
      let src=new File({ contents: new Buffer('{ "name": "gulp-david" }') });
      new Checker()._transform(src, 'utf8', function(err, dest) {
        assert.ifError(err);
        assert('david' in dest);
        done();
      });
    });
  }
};

// Run all tests.
CheckerTest.run();
