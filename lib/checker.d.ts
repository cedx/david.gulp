/// <reference types="node" />
import { DependencyMap } from 'david';
import { Transform, TransformCallback } from 'stream';
import File from 'vinyl';
import { Reporter } from './reporter';
/** Checks whether the dependencies of a project are out of date. */
export declare class Checker extends Transform {
    /** The condition indicating that an error occurred. */
    error: ErrorCondition;
    /** The list of dependencies to ignore. */
    ignore: string[];
    /** The [npm](https://www.npmjs.com) registry URL. */
    registry: URL;
    /** The instance used to output the report. */
    reporter?: Reporter;
    /** Value indicating whether to use unstable dependencies. */
    unstable: boolean;
    /** The operator to use in version comparators. */
    update: string;
    /** Value indicating whether to output the versions of all dependencies instead of only the outdated ones. */
    verbose: boolean;
    /**
     * Creates a new checker.
     * @param options An object specifying values used to initialize this instance.
     */
    constructor(options?: Partial<CheckerOptions>);
    /**
     * Gets details about project dependencies.
     * @param manifest The manifest providing the dependencies.
     * @return An object providing details about the dependencies.
     */
    getDependencies(manifest: object): Promise<DependencyReport>;
    /**
     * Gets details about project dependencies that are outdated.
     * @param manifest The manifest providing the dependencies.
     * @return An object providing details about the dependencies that are outdated.
     */
    getUpdatedDependencies(manifest: object): Promise<DependencyReport>;
    /**
     * Parses the manifest contained in the specified file.
     * @param file The file to read.
     * @param encoding The file encoding.
     * @return A manifest providing a list of dependencies.
     * @throws [[Error]] The file is a stream or is empty.
     * @throws [[SyntaxError]] The manifest has an invalid format.
     */
    parseManifest(file: File, encoding?: string): Record<string, any>;
    /**
     * Transforms input and produces output.
     * @param file The chunk to transform.
     * @param encoding The encoding type if the chunk is a string.
     * @param callback The function to invoke when the supplied chunk has been processed.
     * @return The transformed chunk.
     */
    _transform(file: File, encoding?: string, callback?: TransformCallback): Promise<File>;
    /**
     * Gets details about project dependencies.
     * @param getter The function invoked to fetch the dependency details.
     * @param manifest The manifest providing the list of dependencies.
     * @return An object providing details about the project dependencies.
     */
    private _getDependencies;
}
/** Defines the options of a [[Checker]] instance. */
export interface CheckerOptions {
    /** The list of dependencies to ignore. */
    ignore: string[];
    /** The [npm](https://www.npmjs.com) registry URL. */
    registry: URL;
    /** The instance used to output the report. */
    reporter: Reporter;
    /** Value indicating whether to use unstable dependencies. */
    unstable: boolean;
    /** The operator to use in version comparators. */
    update: string;
    /** Value indicating whether to output the versions of all dependencies instead of only the outdated ones. */
    verbose: boolean;
}
/** Provides information about a package dependencies. */
export interface DependencyReport extends Record<string, DependencyMap> {
    /** Information about the dependencies. */
    dependencies: DependencyMap;
    /** Information about the development dependencies. */
    devDependencies: DependencyMap;
    /** Information about the optional dependencies. */
    optionalDependencies: DependencyMap;
}
/** Defines the condition indicating that an error occurred. */
export interface ErrorCondition {
    /** If a dependency is not found, emit an error. */
    404: boolean;
    /** If greater than `0`, emit an error when the count of outdated dependencies equals or exceeds the specified value. */
    depCount: number;
    /** If a dependency version is invalid (not a string), emit an error. */
    depType: boolean;
    /** If a dependency version is a source control URL, emit an error. */
    scm: boolean;
}
