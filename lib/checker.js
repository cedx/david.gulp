import david from 'david';
import { Transform } from 'stream';
import { promisify } from 'util';
/** Checks whether the dependencies of a project are out of date. */
export class Checker extends Transform {
    /**
     * Creates a new checker.
     * @param options An object specifying values used to initialize this instance.
     */
    constructor(options = {}) {
        super({ objectMode: true });
        /** The condition indicating that an error occurred. */
        this.error = {
            404: false,
            depCount: 0,
            depType: false,
            scm: false
        };
        const { ignore = [], registry = new URL('https://registry.npmjs.org/'), reporter, unstable = false, update = '', verbose = false } = options;
        this.ignore = ignore;
        this.registry = registry;
        this.reporter = reporter;
        this.unstable = unstable;
        this.update = update;
        this.verbose = verbose;
    }
    /**
     * Gets details about project dependencies.
     * @param manifest The manifest providing the dependencies.
     * @return An object providing details about the dependencies.
     */
    async getDependencies(manifest) {
        return this._getDependencies(david.getDependencies, manifest);
    }
    /**
     * Gets details about project dependencies that are outdated.
     * @param manifest The manifest providing the dependencies.
     * @return An object providing details about the dependencies that are outdated.
     */
    async getUpdatedDependencies(manifest) {
        return this._getDependencies(david.getUpdatedDependencies, manifest);
    }
    /**
     * Parses the manifest contained in the specified file.
     * @param file The file to read.
     * @param encoding The file encoding.
     * @return A manifest providing a list of dependencies.
     * @throws [[Error]] The file is a stream or is empty.
     * @throws [[SyntaxError]] The manifest has an invalid format.
     */
    parseManifest(file, encoding = 'utf8') {
        if (file.isNull())
            throw new Error('Empty manifest.');
        if (file.isStream())
            throw new Error('Streams are not supported.');
        const manifest = JSON.parse(file.contents.toString(encoding));
        if (!manifest || typeof manifest != 'object')
            throw new SyntaxError('Invalid manifest format.');
        return manifest;
    }
    /**
     * Transforms input and produces output.
     * @param file The chunk to transform.
     * @param encoding The encoding type if the chunk is a string.
     * @param callback The function to invoke when the supplied chunk has been processed.
     * @return The transformed chunk.
     */
    async _transform(file, encoding = 'utf8', callback) {
        const getDeps = (mf) => this.verbose ? this.getDependencies(mf) : this.getUpdatedDependencies(mf);
        try {
            const manifest = this.parseManifest(file);
            const deps = await getDeps(manifest);
            file.david = deps; // eslint-disable-line require-atomic-updates
            if (this.reporter)
                this.reporter.log(file);
            if (this.update.length) {
                for (const type of Object.keys(deps))
                    for (const [name, dependency] of Object.entries(deps[type]))
                        manifest[type][name] = `${this.update}${this.unstable ? dependency.latest : dependency.stable}`;
                file.contents = Buffer.from(JSON.stringify(manifest, null, 2), encoding); // eslint-disable-line require-atomic-updates
            }
            const count = Object.keys(deps).reduce((accumulator, type) => accumulator + Object.keys(deps[type]).length, 0);
            if (this.error.depCount > 0 && count >= this.error.depCount)
                throw new Error(`Outdated dependencies: ${count}`);
            if (callback)
                callback(null, file);
        }
        catch (err) {
            if (callback)
                callback(new Error(`[@cedx/gulp-david] ${err.message}`));
            else
                throw err;
        }
        return file;
    }
    /**
     * Gets details about project dependencies.
     * @param getter The function invoked to fetch the dependency details.
     * @param manifest The manifest providing the list of dependencies.
     * @return An object providing details about the project dependencies.
     */
    async _getDependencies(getter, manifest) {
        const options = {
            error: { E404: this.error['404'], EDEPTYPE: this.error.depType, ESCM: this.error.scm },
            ignore: this.ignore,
            loose: true,
            stable: !this.unstable
        };
        if (this.registry)
            options.npm = {
                registry: this.registry.href
            };
        const getDeps = promisify(getter);
        const [dependencies, devDependencies, optionalDependencies] = await Promise.all([
            getDeps(manifest, { ...options, dev: false, optional: false }),
            getDeps(manifest, { ...options, dev: true, optional: false }),
            getDeps(manifest, { ...options, dev: false, optional: true })
        ]);
        return { dependencies, devDependencies, optionalDependencies };
    }
}
