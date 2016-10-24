/**
 * Implementation of the `david.Checker` class.
 */
const david = require('david');
const {Observable} = require('rxjs');
const pkg = require('../package.json');
const Reporter = require('./reporter');
const {Transform} = require('stream');

/**
 * Checks whether the dependencies of a project are out of date.
 */
module.exports = class Checker extends Transform {

  /**
   * Initializes a new instance of the class.
   * @param {object} [options] The checker settings.
   */
  constructor(options = {}) {
    super({objectMode: true});

    /**
     * The checker settings.
     * @type {object}
     */
    this._options = {
      error404: false,
      errorDepCount: 0,
      errorDepType: false,
      errorSCM: false,
      ignore: [],
      registry: '',
      reporter: true,
      unstable: false,
      update: false
    };

    Object.assign(this._options, options);
    if (typeof this._options.reporter == 'boolean' && this._options.reporter) this._options.reporter = new Reporter();
    if (typeof this._options.update == 'boolean' && this._options.update) this._options.update = '^';
  }

  /**
   * Gets details about project dependencies.
   * @param {object} manifest The manifest providing the dependencies.
   * @return {Observable<object>} An object providing details about the dependencies.
   */
  getDependencies(manifest) {
    return this._getDependencies(david.getDependencies, manifest);
  }

  /**
   * Gets details about project dependencies that are outdated.
   * @param {object} manifest The manifest providing the dependencies.
   * @return {Observable<object>} An object providing details about the dependencies that are outdated.
   */
  getUpdatedDependencies(manifest) {
    return this._getDependencies(david.getUpdatedDependencies, manifest);
  }

  /**
   * Parses the manifest contained in the specified file.
   * @param {vinyl.File} file The file to read.
   * @param {string} [encoding] The encoding type.
   * @return {object} A manifest providing a list of dependencies.
   * @throws {Error} The file is a stream, or the manifest is invalid.
   */
  parseManifest(file, encoding = 'utf8') {
    if (file.isNull()) throw new Error(`[${pkg.name}] Empty manifest: ${file.path}`);
    if (file.isStream()) throw new Error(`[${pkg.name}] Streams are not supported.`);

    let manifest;
    try {
      manifest = JSON.parse(file.contents.toString(encoding));
      if (typeof manifest != 'object' || !manifest) throw new Error('Invalid manifest format.');
    }

    catch (err) { throw new Error(`[${pkg.name}] Invalid manifest: ${file.path}`); }
    return manifest;
  }

  /**
   * Gets details about project dependencies.
   * @param {function} getter The function invoked to fetch the dependency details.
   * @param {object} manifest The manifest providing the list of dependencies.
   * @return {Observable<object>} An object providing details about the project dependencies.
   */
  _getDependencies(getter, manifest) {
    let options = {
      error: {E404: this._options.error404, EDEPTYPE: this._options.errorDepType, ESCM: this._options.errorSCM},
      ignore: Array.isArray(this._options.ignore) ? this._options.ignore : [],
      loose: true,
      stable: !this._options.unstable
    };

    if (this._options.registry.length) options.npm = {
      registry: this._options.registry
    };

    let getDeps = Observable.bindNodeCallback(getter);
    return Observable
      .from([
        {dev: false, optional: false},
        {dev: true, optional: false},
        {dev: false, optional: true}
      ])
      .map(params => Object.assign({}, options, params))
      .flatMap(params => getDeps(manifest, params))
      .toArray()
      .map(deps => {
        console.log('_getDependencies');
        console.log(deps);
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
   */
  _transform(file, encoding, callback) {
    let manifest;
    try { manifest = this.parseManifest(file); }
    catch (err) {
      callback(err);
      return;
    }

    this.getUpdatedDependencies(manifest).subscribe(
      deps => {
        file.david = deps;

        if (typeof this._options.reporter == 'object' && typeof this._options.reporter.log == 'function')
          this._options.reporter.log(file, encoding);

        if (typeof this._options.update == 'string') {
          for (let type in deps) {
            let version = this._options.unstable ? 'latest' : 'stable';
            for (let name in deps[type]) manifest[type][name] = this._options.update + deps[type][name][version];
          }

          file.contents = Buffer.from(JSON.stringify(manifest, null, 2), encoding);
        }

        let count = Object.keys(deps).reduce((previousValue, depType) => previousValue + Object.keys(deps[depType]).length, 0);
        if (this._options.errorDepCount > 0 && count >= this._options.errorDepCount)
          callback(new Error(`[${pkg.name}] ${count} outdated dependencies`));
        else
          callback(null, file);
      },
      err => callback(new Error(`[${pkg.name}] ${err}`))
    );
  }
};
