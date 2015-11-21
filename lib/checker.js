/**
 * Implementation of the `david.Checker` class.
 * @module checker
 */
'use strict';

// Module dependencies.
const david=require('david');
const pkg=require('../package.json');
const Transform=require('stream').Transform;

/**
 * Checks whether the dependencies of a project are out of date.
 * @extends stream.Transform
 */
class Checker extends Transform {

  /**
   * Initializes a new instance of the class.
   * @param {object} [options] The checker settings.
   */
  constructor(options) {
    super({ objectMode: true });

    /**
     * The checker settings.
     * @type {object}
     */
    this._options={
      error404: false,
      errorDepType: false,
      errorSCM: false,
      ignore: [],
      registry: null,
      update: false,
      unstable: false
    };

    if(typeof options=='object' && options) Object.assign(this._options, options);
  }

  /**
   * Gets details about project dependencies.
   * @param {object} manifest The manifest providing the dependencies.
   * @return {Promise} An object providing details about the dependencies.
   */
  getDependencies(manifest) {
    return this._getDependencies(david.getDependencies, manifest);
  }

  /**
   * Gets details about project dependencies that are outdated.
   * @param {object} manifest The manifest providing the dependencies.
   * @return {Promise} An object providing details about the dependencies that are outdated.
   */
  getUpdatedDependencies(manifest) {
    return this._getDependencies(david.getUpdatedDependencies, manifest);
  }

  /**
   * Parses the manifest contained in the specified file.
   * @param {vinyl.File} file The file to read.
   * @return {object} A manifest providing a list of dependencies.
   * @throws {Error} The file is a stream, or the manifest is invalid.
   */
  parseManifest(file) {
    if(file.isNull()) throw new Error(`[${pkg.name}] Empty manifest: ${file.path}`);
    if(file.isStream()) throw new Error(`[${pkg.name}] Streams are not supported.`);

    let manifest;
    try {
      manifest=JSON.parse(file.contents);
      if(typeof manifest!='object' || !manifest) throw new Error();
    }

    catch(e) { throw new Error(`[${pkg.name}] Invalid manifest: ${file.path}`); }
    return manifest;
  }

  /**
   * Gets details about project dependencies.
   * @param {function} getter The function invoked to fetch the dependency details.
   * @param {object} manifest The manifest providing the list of dependencies.
   * @return {Promise} An object providing details about the project dependencies.
   * @private
   */
  _getDependencies(getter, manifest) {
    let options={
      ignore: Array.isArray(this._options.ignore) ? this._options.ignore : [],
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

    let getDeps=(mf, opts) =>
      new Promise((resolve, reject) => {
        getter(mf, opts, (err, deps) => {
          if(err) reject(err);
          else resolve(deps);
        });
      });

    let promises=[
      getDeps(manifest, Object.assign(options, { dev: false, optional: false })),
      getDeps(manifest, Object.assign(options, { dev: true, optional: false })),
      getDeps(manifest, Object.assign(options, { dev: false, optional: true }))
    ];

    return Promise.all(promises).then(function(deps) {
      return {
        dependencies: deps[0],
        devDependencies: deps[1],
        optionalDependencies: deps[2]
      };
    });
  }

  /**
   * Transforms input and produces output.
   * @param {vinyl.File} file The chunk to be transformed.
   * @param {string} encoding The encoding type if the chunk is a string.
   * @param {function} callback The function to invoke when the supplied chunk has been processed.
   * @private
   */
  _transform(file, encoding, callback) {
    let manifest;
    try { manifest=this.parseManifest(file); }
    catch(e) {
      callback(e);
      return;
    }

    this.getUpdatedDependencies(manifest).then(
      deps => {
        if(this._options.update) {
          for(let type in deps) {
            let version=(this._options.unstable ? 'latest' : 'stable');
            for(let name in deps[type]) manifest[type][name]='^'+deps[type][name][version];
          }

          file.contents=new Buffer(JSON.stringify(manifest, null, 2));
        }

        file.david=deps;
        callback(null, file);
      },
      err => callback(new Error(`[${pkg.name}] ${err}`))
    );
  }
}

// Public interface.
module.exports=Checker;
