/**
 * Unit tests of the `reporter` module.
 * @module test.reporter_test
 */
'use strict';

// Module dependencies.
const assert=require('assert');
const File=require('vinyl');
const Reporter=require('../lib/reporter');

/**
 * Tests the features of the `david.Reporter` class.
 * @class david.tests.ReporterTest
 * @static
 */
const ReporterTest={

  /**
   * Runs the unit tests.
   * @method run
   */
  run: function() {
    let self=this;
    describe('Reporter', function() {
      describe('_transform()', self.testTransform);
    });
  },

  /**
   * Tests the `_transform` method.
   * @method testTransform
   */
  testTransform: function() {
    it('should emit an error if "david" property is not found on the file object', function(done) {
      new Reporter()._transform(new File(), 'utf8', function(err) {
        assert(err instanceof Error);
        done();
      });
    });
  }
};

// Run all tests.
ReporterTest.run();
