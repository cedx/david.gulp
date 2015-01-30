/**
 * TODO
 * @module david
 */
'use strict';

// Module dependencies.
var child=require('child_process');
var util=require('util');

/**
 * TODO
 * @class david.Plugin
 * @static
 */
function davidPlugin(opts) {
  // not very clean... TODO
  var options=util._extend({}, davidPlugin.DEFAULT_OPTIONS);
  options=util._extend(options, opts);
  
  var path=path.join(__dirname, '../node_modules/.bin');
  
  var command=[ 'david' ];
  if(options.update) command.push('update');
  if(options.global) command.push('--global');
  if(options.unstable) command.push('--unstable');

  if(typeof options.registry=='string') {
    command.push('--registry');
    command.push(options.registry);
  }
  
  if(options.error404) command.push('--error404');
  if(options.errorDepType) command.push('--errorDepType');
  if(options.errorSCM) command.push('--errorSCM');
  
  _exec();
}

// TODO
davidPlugin.DEFAULT_OPTIONS={
  error404: false,
  errorDepType: false,
  errorSCM: false,
  global: false,
  registry: null,
  update: false,
  unstable: false
};

/**
 * Runs a command and prints its output.
 * @method _exec
 * @param {String} command The command to run, with space-separated arguments.
 * @param {Function} callback The function to invoke when the task is over.
 * @async
 * @private
 */
function _exec(command, callback) {
  child.exec(command, function(err, stdout) {
    console.log(stdout.trim());
    if(err) console.error(err);
    callback();
  });
}

// Public interface.
module.exports=davidPlugin;
