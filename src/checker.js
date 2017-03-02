import david from 'david';
import * as pkg from '../package.json';
import {Reporter} from './reporter';
import {Transform} from 'stream';

/**
 * Checks whether the dependencies of a project are out of date.
 */
export class Checker extends Transform {

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
      error404: typeof options.error404 == 'boolean' ? options.error404 : false,
      errorDepCount: typeof options.errorDepCount == 'number' ? options.errorDepCount : 0,
      errorDepType: typeof options.errorDepType == 'boolean' ? options.errorDepType : false,
      errorSCM: typeof options.errorSCM == 'boolean' ? options.errorSCM : false,
      ignore: Array.isArray(options.ignore) ? options.ignore : [],
      registry: typeof options.registry == 'string' ? options.registry : '',
      reporter: typeof options.reporter != 'undefined' ? options.reporter : true,
      unstable: typeof options.unstable == 'boolean' ? options.unstable : false,
      update: typeof options.update != 'undefined' ? options.update : false,
      verbose: typeof options.verbose == 'boolean' ? options.verbose : false
    };

    if (typeof this._options.reporter == 'boolean' && this._options.reporter) this._options.reporter = new Reporter();
    if (typeof this._options.update == 'boolean' && this._options.update) this._options.update = '^';
  }

  /**
   * Gets details about project dependencies.
   * @param {object} manifest The manifest providing the dependencies.
   * @return {Promise<object>} An object providing details about the dependencies.
   */
  async getDependencies(manifest) {
    return this._getDependencies(david.getDependencies, manifest);
  }

  /**
   * Gets details about project dependencies that are outdated.
   * @param {object} manifest The manifest providing the dependencies.
   * @return {Promise<object>} An object providing details about the dependencies that are outdated.
   */
  async getUpdatedDependencies(manifest) {
    return this._getDependencies(david.getUpdatedDependencies, manifest);
  }

  /**
   * Parses the manifest contained in the specified file.
   * @param {File} file The file to read.
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
   * @return {Promise<object>} An object providing details about the project dependencies.
   */
  async _getDependencies(getter, manifest) {
    let options = {
      error: {E404: this._options.error404, EDEPTYPE: this._options.errorDepType, ESCM: this._options.errorSCM},
      ignore: this._options.ignore,
      loose: true,
      stable: !this._options.unstable
    };

    if (this._options.registry.length) options.npm = {
      registry: this._options.registry
    };

    let getDeps = (mf, opts) => new Promise((resolve, reject) => getter(mf, opts, (err, deps) => {
      if (err) reject(err);
      else resolve(deps);
    }));

    let deps = await Promise.all([
      getDeps(manifest, Object.assign({}, options, {dev: false, optional: false})),
      getDeps(manifest, Object.assign({}, options, {dev: true, optional: false})),
      getDeps(manifest, Object.assign({}, options, {dev: false, optional: true}))
    ]);

    return {
      dependencies: deps[0],
      devDependencies: deps[1],
      optionalDependencies: deps[2]
    };
  }

  /**
   * Transforms input and produces output.
   * @param {File} file The chunk to be transformed.
   * @param {string} encoding The encoding type if the chunk is a string.
   * @param {function} callback The function to invoke when the supplied chunk has been processed.
   * @return {Promise} Completes when the chunk has been transformed.
   */
  async _transform(file, encoding, callback) {
    let manifest;
    try { manifest = this.parseManifest(file); }
    catch (err) {
      callback(new Error(`[${pkg.name}] ${err}`));
      return null;
    }

    try {
      let getDeps = mf => this._options.verbose ? this.getDependencies(mf) : this.getUpdatedDependencies(mf);
      let deps = await getDeps(manifest);
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
    }

    catch (err) {
      callback(new Error(`[${pkg.name}] ${err}`));
    }

    return null;
  }
}
