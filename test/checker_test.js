/**
 * Unit tests of the `checker` module.
 * @module test.checker_test
 */
'use strict';

// Module dependencies.
var assert=require('assert');
var Checker=require('../lib/checker');
var File=require('vinyl');
var gulp=require('gulp');
var stream=require('stream');

/**
 * Tests the features of the `david.Checker` class.
 * @class david.tests.CheckerTest
 * @static
 */
var CheckerTest={

  /**
   * Runs the unit tests.
   * @method run
   */
  run: function() {
    var self=this;
    describe('Checker', function() {
      describe('getDependencies()', self.testGetDependencies);
      describe('getUpdatedDependencies()', self.testGetUpdatedDependencies);
      describe('parseManifest()', self.testParseManifest);
      describe('_transform()', self.testTransform);
    });
  },

  /**
   * Tests the `getDependencies` method.
   * @method testGetDependencies
   */
  testGetDependencies: function() {
  },

  /**
   * Tests the `getUpdatedDependencies` method.
   * @method testGetUpdatedDependencies
   */
  testGetUpdatedDependencies: function() {
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
        var file=new File({ contents: new stream.Readable() });
        new Checker().parseManifest(file);
      });
    });

    it('should throw an error if manifest is invalid', function() {
      assert.throws(function() {
        var file=new File({ contents: new Buffer('FooBar') });
        new Checker().parseManifest(file);
      });
    });

    it('should return an object if manifest is valid', function() {
      var file=new File({ contents: new Buffer('{ "name": "gulp-david" }') });
      assert.deepEqual(new Checker().parseManifest(file), { name: 'gulp-david' });
    });
  },

  /**
   * Tests the `_transform` method.
   * @method testTransform
   */
  testTransform: function() {
  }
};

// Run all tests.
CheckerTest.run();
