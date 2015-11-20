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
class ReporterTest {

  /**
   * Runs the unit tests.
   * @method run
   */
  run() {
    let self=this;
    describe('Reporter', function() {
      describe('_transform()', self.testTransform);
    });
  }

  /**
   * Tests the `_transform` method.
   * @method testTransform
   */
  testTransform() {
    it('should emit an error if "david" property is not found on the file object', done => {
      new Reporter()._transform(new File(), 'utf8', err => {
        assert(err instanceof Error);
        done();
      });
    });
  }
}

// Run all tests.
new ReporterTest().run();
