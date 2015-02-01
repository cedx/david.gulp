/**
 * Unit tests of the `reporter` module.
 * @module test.reporter_test
 */
'use strict';

// Module dependencies.
var assert=require('assert');
var gulp=require('gulp');
var Reporter=require('../lib/reporter');

/**
 * Tests the features of the `david.Reporter` class.
 * @class david.tests.ReporterTest
 * @static
 */
var ReporterTest={

  /**
   * Runs the unit tests.
   * @method run
   */
  run: function() {
    var self=this;
    describe('Reporter', function() {
      describe('_transform()', self.testTransform);
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
ReporterTest.run();
