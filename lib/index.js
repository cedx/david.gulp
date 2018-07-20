const {Checker} = require('./checker.js');
const {Reporter} = require('./reporter.js');

module.exports = {
  david: Checker.factory,
  Checker,
  Reporter
};
