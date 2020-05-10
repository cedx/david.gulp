/** Provides typings for the [David](https://david-dm.org) module. */
declare module 'david' {

  /** Provides metrics about a package dependency. */
  export interface Dependency {

    /** The latest version. */
    latest: string;

    /** The required version. */
    required: string;

    /** The stable version. */
    stable: string;

    /** The occurred error, if any. */
    warn: Error;
  }

  /** A dictionary that maps dependency names to their metrics. */
  export type DependencyMap = Record<string, Partial<Dependency>>;

  /** A function that gets a list of dependencies for the passed manifest. */
  export type GetDependenciesCallback = (error: Error|null, result: DependencyMap) => void;

  /** A function that gets a list of dependencies for the passed manifest. */
  export type GetDependenciesFunction = (manifest: object, opts: Partial<GetDependenciesOptions>, cb: GetDependenciesCallback) => void;

  /** Provides options for a [[GetDependenciesFunction]] function. */
  export interface GetDependenciesOptions {

    /** Consider the `devDependencies` section. */
    dev: boolean;

    /** Trigger an error on specific condition. */
    error: Partial<{
      E404: boolean;
      EDEPTYPE: boolean;
      ESCM: boolean;
    }>;

    /** List of dependency names to ignore. */
    ignore: string[];

    /** Use loose option when querying semver. */
    loose: boolean;

    /** The `npm` configuration options. */
    npm: {registry: string};

    /** Consider the `optionalDependencies` section. */
    optional: boolean;

    /** Consider the `peerDependencies` section. */
    peer: boolean;

    /** For each dependency, return the available versions for the range specified in the `package.json` file. */
    rangeVersions: boolean;

    /** Consider only stable packages. */
    stable: boolean;

    /** For each dependency, return the available versions. */
    versions: boolean;
  }

  /**
   * Gets a list of dependencies for the passed manifest.
   * @param manifest The parsed `package.json` file contents.
   * @param opts The options passed to the underlying invoked function.
   * @param cb The function that receives the results.
   */
  export function getDependencies(manifest: object, opts: Partial<GetDependenciesOptions>, cb: GetDependenciesCallback): void;

  /**
   * Gets a list of updated dependencies for the passed manifest.
   * @param manifest The parsed `package.json` file contents.
   * @param opts The options passed to the underlying invoked function.
   * @param cb The function that receives the results.
   */
  export function getUpdatedDependencies(manifest: object, opts: Partial<GetDependenciesOptions>, cb: GetDependenciesCallback): void;
}
