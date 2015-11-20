/**
 * Package entry point.
 * @module index
 */
'use strict';

// Module dependencies.
const Checker=require('./lib/checker');
const Reporter=require('./lib/reporter');

// Public interface.
module.exports=function(options) { return new Checker(options); };
module.exports.reporter=new Reporter();
