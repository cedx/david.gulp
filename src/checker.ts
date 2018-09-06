import {getDependencies, getUpdatedDependencies} from 'david';
import {Transform, TransformCallback} from 'stream';
import {promisify} from 'util';
import * as File from 'vinyl';

// @ts-ignore: disable processing of the imported JSON file.
import * as pkg from '../package.json';
import {JsonMap} from './map';
import {Reporter} from './reporter';

/**
 * Checks whether the dependencies of a project are out of date.
 */
export class Checker extends Transform {

  /**
   * The condition indicating that an error occurred.
   */
  error: ErrorCondition = {
    404: false,
    depCount: 0,
    depType: false,
    scm: false
  };

  /**
   * The list of dependencies to ignore.
   */
  ignore: string[];

  /**
   * The [npm](https://www.npmjs.com) registry URL.
   */
  registry: URL;

  /**
   * The instance used to output the report.
   */
  reporter: Reporter;

  /**
   * Value indicating whether to use unstable dependencies.
   */
  unstable: boolean;

  /**
   * The operator to use in version comparators.
   */
  update: string;

  /**
   * Value indicating whether to output the versions of all dependencies instead of only the outdated ones.
   */
  verbose: boolean;

  /**
   * Creates a new checker.
   * @param options An object specifying values used to initialize this instance.
   */
  constructor(options: Partial<CheckerOptions> = {}) {
    super({objectMode: true});

    const {
      ignore = [],
      registry = 'https://registry.npmjs.org',
      reporter = new Reporter,
      unstable = false,
      update = '',
      verbose = false
    } = options;

    this.ignore = ignore;
    this.registry = typeof registry == 'string' ? new URL(registry) : registry;
    this.reporter = reporter;
    this.unstable = unstable;
    this.update = update;
    this.verbose = verbose;
  }

  /**
   * The class name.
   */
  get [Symbol.toStringTag](): string {
    return 'Checker';
  }

  /**
   * Gets details about project dependencies.
   * @param manifest The manifest providing the dependencies.
   * @return An object providing details about the dependencies.
   */
  async getDependencies(manifest: JsonMap): Promise<JsonMap> {
    return this._getDependencies(getDependencies, manifest);
  }

  /**
   * Gets details about project dependencies that are outdated.
   * @param manifest The manifest providing the dependencies.
   * @return An object providing details about the dependencies that are outdated.
   */
  async getUpdatedDependencies(manifest: JsonMap): Promise<JsonMap> {
    return this._getDependencies(getUpdatedDependencies, manifest);
  }

  /**
   * Parses the manifest contained in the specified file.
   * @param file The file to read.
   * @param encoding The file encoding.
   * @return A manifest providing a list of dependencies.
   * @throws {Error} The file is a stream, or the manifest is invalid.
   */
  parseManifest(file: File, encoding: string = 'utf8'): JsonMap {
    if (file.isNull()) throw new Error(`Empty manifest: ${file.path}`);
    if (file.isStream()) throw new Error('Streams are not supported.');

    const manifest = JSON.parse((file.contents as Buffer).toString(encoding));
    if (typeof manifest != 'object' || !manifest) throw new Error('Invalid manifest format.');
    return manifest;
  }

  /**
   * Transforms input and produces output.
   * @param file The chunk to transform.
   * @param encoding The encoding type if the chunk is a string.
   * @param callback The function to invoke when the supplied chunk has been processed.
   * @return The transformed chunk.
   */
  async _transform(file: File, encoding: string = 'utf8', callback?: TransformCallback): Promise<File> {
    const getDeps = (mf: JsonMap) => this.verbose ? this.getDependencies(mf) : this.getUpdatedDependencies(mf);

    try {
      const manifest = this.parseManifest(file);
      const deps = await getDeps(manifest);
      file.david = deps;
      if (this.reporter) this.reporter.log(file);

      if (this.update.length) {
        const version = this.unstable ? 'latest' : 'stable';
        for (const type of Object.keys(deps))
          for (const [name, dependency] of Object.entries(deps[type])) manifest[type][name] = this.update + dependency[version];

        file.contents = Buffer.from(JSON.stringify(manifest, null, 2), encoding);
      }

      const count = Object.keys(deps).reduce((previousValue, type) => previousValue + Object.keys(deps[type]).length, 0);
      if (this.error.depCount > 0 && count >= this.error.depCount) throw new Error(`Outdated dependencies: ${count}`);
      if (callback) callback(undefined, file);
    }

    catch (err) {
      if (callback) callback(new Error(`[${pkg.name}] ${err.message}`));
      else throw err;
    }

    return file;
  }

  /**
   * Gets details about project dependencies.
   * @param {function} getter The function invoked to fetch the dependency details.
   * @param manifest The manifest providing the list of dependencies.
   * @return An object providing details about the project dependencies.
   */
  private async _getDependencies(getter, manifest: JsonMap): Promise<JsonMap> {
    const options: JsonMap = {
      error: {E404: this.error['404'], EDEPTYPE: this.error.depType, ESCM: this.error.scm},
      ignore: this.ignore,
      loose: true,
      stable: !this.unstable
    };

    if (this.registry) options.npm = {
      registry: this.registry.href
    };

    const getDeps = promisify(getter);
    const [dependencies, devDependencies, optionalDependencies] = await Promise.all([
      getDeps(manifest, Object.assign({}, options, {dev: false, optional: false})),
      getDeps(manifest, Object.assign({}, options, {dev: true, optional: false})),
      getDeps(manifest, Object.assign({}, options, {dev: false, optional: true}))
    ]);

    return {dependencies, devDependencies, optionalDependencies};
  }
}

/**
 * Defines the options of a `Checker` instance.
 */
export interface CheckerOptions {

  /**
   * The list of dependencies to ignore.
   */
  ignore: string[];

  /**
   * The [npm](https://www.npmjs.com) registry URL.
   */
  registry: string | URL;

  /**
   * The instance used to output the report.
   */
  reporter: Reporter;

  /**
   * Value indicating whether to use unstable dependencies.
   */
  unstable: boolean;

  /**
   * The operator to use in version comparators.
   */
  update: string;

  /**
   * Value indicating whether to output the versions of all dependencies instead of only the outdated ones.
   */
  verbose: boolean;
}

/**
 * Defines the condition indicating that an error occurred.
 */
export interface ErrorCondition {

  /**
   * If a dependency is not found, emit an error.
   */
  404: boolean;

  /**
   * If greater than `0`, emit an error when the count of outdated dependencies equals or exceeds the specified value.
   */
  depCount: number;

  /**
   * If a dependency version is invalid (not a string), emit an error.
   */
  depType: boolean;

  /**
   * If a dependency version is a source control URL, emit an error.
   */
  scm: boolean;
}
