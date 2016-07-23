/**
 * Package entry point.
 * @module index
 */
const Checker = require('./checker');
module.exports = options => new Checker(options);
