import File from 'vinyl';
/** Defines the shape of a dependency reporter. */
export interface Reporter {
    /**
     * Logs the outdated dependencies provided by the specified file.
     * @param file The file providing the outdated dependencies.
     */
    log: (file: File) => void;
}
/** Prints the checker results to the standard output. */
export declare class ConsoleReporter implements Reporter {
    /**
     * Logs to the standard output the outdated dependencies provided by the specified file.
     * @param file The file providing the outdated dependencies.
     * @param returnOutput Value indicating whether to return the output of the outdated dependencies, rather than print it.
     * @return The output of the outdated dependencies.
     * @throws `Error` The dependencies were not found in the file.
     */
    log(file: File, returnOutput?: boolean): string | undefined;
    /**
     * Builds the output of the outdated dependencies provided by the specified file.
     * @param file The file providing the outdated dependencies.
     * @return The output of the outdated dependencies.
     */
    private _report;
}
