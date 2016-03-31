/**
 * Package entry point.
 * @module index
 */
'use strict';

// Module dependencies.
const Checker = require('./checker');

// Public interface.
module.exports = (options => new Checker(options));
