/**
 * Implementation of the `david.Checker` class.
 * @module checker
 */
'use strict';

// Module dependencies.
const david=require('david');
const pkg=require('../package.json');
const Transform=require('stream').Transform;
const util=require('util');

/**
 * Checks whether the dependencies of a project are out of date.
 * @class david.Checker
 * @extends stream.Transform
 * @constructor
 * @param {Object} [options] The checker settings.
 */
function Checker(options) {
  Transform.call(this, { objectMode: true });

  /**
   * The checker settings.
   * @property _options
   * @type Object
   * @private
   */
  this._options=util._extend({
    error404: false,
    errorDepType: false,
    errorSCM: false,
    registry: null,
    update: false,
    unstable: false
  }, options);
}

// Prototype chain.
util.inherits(Checker, Transform);

/**
 * Gets details about project dependencies.
 * @method getDependencies
 * @param {Object} manifest The manifest providing the dependencies.
 * @return {Promise} An object providing details about the dependencies.
 * @async
 */
Checker.prototype.getDependencies=function(manifest) {
  return this._getDependencies(david.getDependencies, manifest);
};

/**
 * Gets details about project dependencies that are outdated.
 * @method getUpdatedDependencies
 * @param {Object} manifest The manifest providing the dependencies.
 * @return {Promise} An object providing details about the dependencies that are outdated.
 * @async
 */
Checker.prototype.getUpdatedDependencies=function(manifest) {
  return this._getDependencies(david.getUpdatedDependencies, manifest);
};

/**
 * Parses the manifest contained in the specified file.
 * @method parseManifest
 * @param {vinyl.File} file The file to read.
 * @return {Object} A manifest providing a list of dependencies.
 * @throws {Error} The file is a stream, or the manifest is invalid.
 */
Checker.prototype.parseManifest=function(file) {
  if(file.isNull()) throw new Error(util.format('[%s] Empty manifest: %s', pkg.name, file.path));
  if(file.isStream()) throw new Error(util.format('[%s] Streams are not supported.', pkg.name));

  let manifest=null;
  try {
    manifest=JSON.parse(file.contents);
    if(typeof manifest!='object' || !manifest) throw new Error();
  }

  catch(e) { throw new Error(util.format('[%s] Invalid manifest: %s', pkg.name, file.path)); }
  return manifest;
};

/**
 * Gets details about project dependencies.
 * @method _getDependencies
 * @param {Function} getter The function invoked to fetch the dependency details.
 * @param {Object} manifest The manifest providing the list of dependencies.
 * @return {Promise} An object providing details about the project dependencies.
 * @async
 * @private
 */
Checker.prototype._getDependencies=function(getter, manifest) {
  let options={
    loose: true,
    stable: !this._options.unstable,
    error: {
      E404: this._options.error404,
      EDEPTYPE: this._options.errorDepType,
      ESCM: this._options.errorSCM
    }
  };

  if(typeof this._options.registry=='string') options.npm={
    registry: this._options.registry
  };

  let getDeps=function(mf, opts) {
    return new Promise(function(resolve, reject) {
      getter(mf, opts, function(err, deps) {
        if(err) reject(err);
        else resolve(deps);
      });
    });
  };

  let promises=[
    getDeps(manifest, util._extend(options, { dev: false, optional: false })),
    getDeps(manifest, util._extend(options, { dev: true, optional: false })),
    getDeps(manifest, util._extend(options, { dev: false, optional: true }))
  ];

  return Promise.all(promises).then(function(deps) {
    return {
      dependencies: deps[0],
      devDependencies: deps[1],
      optionalDependencies: deps[2]
    };
  });
};

/**
 * Transforms input and produces output.
 * @method _transform
 * @param {vinyl.File} file The chunk to be transformed.
 * @param {String} encoding The encoding type if the chunk is a string.
 * @param {Function} callback The function to invoke when the supplied chunk has been processed.
 * @async
 * @private
 */
Checker.prototype._transform=function(file, encoding, callback) {
  let manifest=null;
  try { manifest=this.parseManifest(file); }
  catch(e) {
    callback(e);
    return;
  }

  let self=this;
  this.getUpdatedDependencies(manifest).then(
    function(deps) {
      if(self._options.update) {
        for(let type in deps) {
          let version=(self._options.unstable ? 'latest' : 'stable');
          for(let name in deps[type]) manifest[type][name]='^'+deps[type][name][version];
        }

        file.contents=new Buffer(JSON.stringify(manifest, null, 2));
      }

      file.david=deps;
      callback(null, file);
    },
    function(err) {
      callback(new Error(util.format('[%s] %s', pkg.name, err)));
    }
  );
};

// Public interface.
module.exports=Checker;
