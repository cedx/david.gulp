/**
 * Unit tests of the `reporter` module.
 * @module test/reporter_test
 */
'use strict';

// Module dependencies.
const assert=require('assert');
const File=require('vinyl');
const Reporter=require('../lib/reporter');

/**
 * Tests the features of the `david.Reporter` class.
 */
class ReporterTest {

  /**
   * Runs the unit tests.
   */
  run() {
    let self=this;
    describe('Reporter', function() {
      describe('log()', self.testLog);
    });
  }

  /**
   * Tests the `log` method.
   */
  testLog() {
    it('should throw an error if "david" property is not found on the file object', () => {
      assert.throws(() => new Reporter().log(new File(), 'utf8'), Error);
    });
  }
}

// Run all tests.
new ReporterTest().run();
