/**
 * Package entry point.
 */
const Checker = require('./checker');
module.exports = options => new Checker(options);
