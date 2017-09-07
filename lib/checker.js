'use strict';

const {getDependencies, getUpdatedDependencies} = require('david');
const {Transform} = require('stream');
const {URL} = require('url');
const {promisify} = require('util');
const {Reporter} = require('./reporter');
const {name: pkgName} = require('../package.json');

/**
 * Checks whether the dependencies of a project are out of date.
 */
exports.Checker = class Checker extends Transform {

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
   * The class name.
   * @type {string}
   */
  get [Symbol.toStringTag]() {
    return 'Checker';
  }

  /**
   * Create a new checker.
   * @param {object} [options] The checker options.
   * @return {Checker} The newly created instance.
   */
  static factory(options = {}) {
    let checker = new Checker(new Reporter);

    if (typeof options.error404 == 'boolean') checker.error['404'] = options.error404;
    if (Number.isInteger(options.errorDepCount)) checker.error.depCount = options.errorDepCount;
    if (typeof options.errorDepType == 'boolean') checker.error.depType = options.errorDepType;
    if (typeof options.errorSCM == 'boolean') checker.error.scm = options.errorSCM;
    if (Array.isArray(options.ignore)) checker.ignore = options.ignore;
    if (typeof options.registry == 'string') checker.registry = new URL(options.registry);
    if (typeof options.unstable == 'boolean') checker.unstable = options.unstable;
    if (typeof options.verbose == 'boolean') checker.verbose = options.verbose;

    if (typeof options.reporter == 'boolean' && !options.reporter) checker.reporter = null;
    else if (typeof options.reporter == 'object' && options.reporter) checker.reporter = options.reporter;

    if (typeof options.update == 'boolean' && options.update) checker.update = '^';
    else if (typeof options.update == 'string') checker.update = options.update;

    return checker;
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
   * @param {string} [encoding] The file encoding.
   * @return {object} A manifest providing a list of dependencies.
   * @throws {Error} The file is a stream, or the manifest is invalid.
   */
  parseManifest(file, encoding = 'utf8') {
    if (file.isNull()) throw new Error(`Empty manifest: ${file.path}`);
    if (file.isStream()) throw new Error('Streams are not supported.');

    let manifest = JSON.parse(file.contents.toString(encoding));
    if (typeof manifest != 'object' || !manifest) throw new Error('Invalid manifest format.');
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
      error: {E404: this.error['404'], EDEPTYPE: this.error.depType, ESCM: this.error.scm},
      ignore: this.ignore,
      loose: true,
      stable: !this.unstable
    };

    if (this.registry) options.npm = {
      registry: this.registry.href
    };

    const getDeps = promisify(getter);
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
   * @param {string} [encoding] The encoding type if the chunk is a string.
   * @param {function} [callback] The function to invoke when the supplied chunk has been processed.
   * @return {Promise<File>} The transformed chunk.
   */
  async _transform(file, encoding = 'utf8', callback = null) {
    const getDeps = mf => this.verbose ? this.getDependencies(mf) : this.getUpdatedDependencies(mf);

    try {
      let manifest = this.parseManifest(file);
      let deps = await getDeps(manifest);
      file.david = deps;
      if (this.reporter && typeof this.reporter.log == 'function') this.reporter.log(file, encoding);

      if (this.update.length) {
        let version = this.unstable ? 'latest' : 'stable';
        for (let type of Object.keys(deps))
          for (let [name, dependency] of Object.entries(deps[type])) manifest[type][name] = this.update + dependency[version];

        file.contents = Buffer.from(JSON.stringify(manifest, null, 2), encoding);
      }

      let count = Object.keys(deps).reduce((previousValue, type) => previousValue + Object.keys(deps[type]).length, 0);
      if (this.error.depCount > 0 && count >= this.error.depCount) throw new Error(`Outdated dependencies: ${count}`);
      if (callback) callback(null, file);
    }

    catch (err) {
      if (callback) callback(new Error(`[${pkgName}] ${err.message}`));
      else throw err;
    }

    return file;
  }
};
