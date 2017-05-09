import {getDependencies, getUpdatedDependencies} from 'david';
import {Transform} from 'stream';
import {name as pkgName} from '../package.json';

/**
 * Checks whether the dependencies of a project are out of date.
 */
export class Checker extends Transform {

  /**
   * Initializes a new instance of the class.
   * @param {object} [reporter] The instance used to output the report.
   */
  constructor(reporter = null) {
    super({objectMode: true});

    /**
     * Values indicating whether to emit an error.
     * @type {object}
     */
    this.error = {
      404: false,
      depCount: 0,
      depType: false,
      scm: false
    };

    /**
     * The list of dependencies to ignore.
     * @type {string[]}
     */
    this.ignore = [];

    /**
     * The [npm](https://www.npmjs.com) registry URL.
     * Uses [registry.npmjs.org](https://registry.npmjs.org) if `null`.
     * @type {URL}
     */
    this.registry = null;

    /**
     * The instance used to output the report.
     * @type {object}
     */
    this.reporter = reporter;

    /**
     * Value indicating whether to use unstable dependencies.
     * @type {boolean}
     */
    this.unstable = false;

    /**
     * The operator to use in version comparators.
     * If empty, the dependencies will not be updated.
     * @type {string}
     */
    this.update = '';

    /**
     * Value indicating whether to output the versions of all dependencies instead of only the outdated ones.
     * @type {boolean}
     */
    this.verbose = false;
  }

  /**
   * Gets details about project dependencies.
   * @param {object} manifest The manifest providing the dependencies.
   * @return {Promise<object>} An object providing details about the dependencies.
   */
  async getDependencies(manifest) {
    return this._getDependencies(getDependencies, manifest);
  }

  /**
   * Gets details about project dependencies that are outdated.
   * @param {object} manifest The manifest providing the dependencies.
   * @return {Promise<object>} An object providing details about the dependencies that are outdated.
   */
  async getUpdatedDependencies(manifest) {
    return this._getDependencies(getUpdatedDependencies, manifest);
  }

  /**
   * Parses the manifest contained in the specified file.
   * @param {File} file The file to read.
   * @param {string} [encoding] The encoding type.
   * @return {object} A manifest providing a list of dependencies.
   * @throws {Error} The file is a stream, or the manifest is invalid.
   */
  parseManifest(file, encoding = 'utf8') {
    try {
      if (file.isNull()) throw new Error(`Empty manifest: ${file.path}`);
      if (file.isStream()) throw new Error('Streams are not supported.');

      let manifest = JSON.parse(file.contents.toString(encoding));
      if (typeof manifest != 'object' || !manifest) throw new Error('Invalid manifest format.');
      return manifest;
    }

    catch (error) {
      throw new Error(`[${pkgName}] Invalid manifest: ${error.message}`);
    }
  }

  /**
   * Gets details about project dependencies.
   * @param {function} getter The function invoked to fetch the dependency details.
   * @param {object} manifest The manifest providing the list of dependencies.
   * @return {Promise<object>} An object providing details about the project dependencies.
   */
  async _getDependencies(getter, manifest) {
    let options = {
      error: {E404: this.error['404'], EDEPTYPE: this.error.depType, ESCM: this.error.scm},
      ignore: this.ignore,
      loose: true,
      stable: !this.unstable
    };

    if (this.registry) options.npm = {
      registry: this.registry.href
    };

    const getDeps = (mf, opts) => new Promise((resolve, reject) => getter(mf, opts, (err, deps) => {
      if (err) reject(err);
      else resolve(deps);
    }));

    let [dependencies, devDependencies, optionalDependencies] = await Promise.all([
      getDeps(manifest, Object.assign({}, options, {dev: false, optional: false})),
      getDeps(manifest, Object.assign({}, options, {dev: true, optional: false})),
      getDeps(manifest, Object.assign({}, options, {dev: false, optional: true}))
    ]);

    return {dependencies, devDependencies, optionalDependencies};
  }

  /**
   * Transforms input and produces output.
   * @param {File} file The chunk to transform.
   * @param {string} encoding The encoding type if the chunk is a string.
   * @param {function} [callback] The function to invoke when the supplied chunk has been processed.
   * @return {Promise<File>} The transformed chunk.
   */
  async _transform(file, encoding, callback) {
    try {
      let getDeps = mf => this.verbose ? this.getDependencies(mf) : this.getUpdatedDependencies(mf);

      let manifest = this.parseManifest(file);
      let deps = await getDeps(manifest);
      file.david = deps;
      if (this.reporter && typeof this.reporter.log == 'function') this.reporter.log(file, encoding);

      if (this.update.length) {
        for (let type in deps) {
          let version = this.unstable ? 'latest' : 'stable';
          for (let name in deps[type]) manifest[type][name] = this.update + deps[type][name][version];
        }

        file.contents = Buffer.from(JSON.stringify(manifest, null, 2), encoding);
      }

      let count = Object.keys(deps).reduce((previousValue, depType) => previousValue + Object.keys(deps[depType]).length, 0);
      if (this.error.depCount > 0 && count >= this.error.depCount) throw new Error(`Outdated dependencies: ${count}`);
      if (typeof callback == 'function') callback(null, file);
    }

    catch (err) {
      if (typeof callback == 'function') callback(new Error(`[${pkgName}] ${err.message}`));
    }

    return file;
  }
}
