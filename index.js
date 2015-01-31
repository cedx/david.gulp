/**
 * Package entry point.
 * @module index
 */
'use strict';

// Module dependencies.
var Checker=require('./lib/checker');
var Reporter=require('./lib/reporter');

// Public interface.
module.exports=function(options) { return new Checker(options); };
module.exports.reporter=new Reporter();
