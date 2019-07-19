# Usage
If you haven't used [Gulp](https://gulpjs.com) before, be sure to check out the [related documentation](https://github.com/gulpjs/gulp/tree/master/docs/getting-started), as it explains how to create a `gulpfile.esm.js` as well as install and use plug-ins.
Once you're familiar with that process, you may install the plug-in.

## Programming interface
The plug-in takes a [`package.json`](https://docs.npmjs.com/files/package.json) file as input, and scans its dependencies to check whether any one is outdated:

```js
const {david} = require('@cedx/gulp-david');
const {src, task} = require('gulp');

task('checkDependencies', () => src('package.json')
  .pipe(david())
  .on('error', function(err) {
    console.error(err);
    this.emit('end');
  })
);
```

### Options
The plug-in can be customized using these settings:

- **error404**: boolean = `false` : If a dependency is not found, emit an error.
- **errorDepCount**: number = `0` : If greater than `0`, emit an error when the count of outdated dependencies equals or exceeds the specified value.
- **errorDepType**: boolean = `false` : If a dependency version is invalid (not a string), emit an error.
- **errorSCM**: boolean = `false` : If a dependency version is a source control URL, emit an error.
- **ignore**: string[] = `[]`: Ignore the specified dependencies.
- **registry**: string | URL = `"https://registry.npmjs.org/"` : The [npm](https://www.npmjs.com) registry URL.
- **reporter**: boolean | Reporter = `true`: Whether a report should be printed to the standard output. If it is an object, it will be used as reporter.
- **unstable**: boolean = `false` : Use unstable dependencies.
- **update**: boolean | string = `false` : Whether to update dependencies in the file contents to latest versions. If it is a string, it will be used as the operator in version comparators.
- **verbose**: boolean = `false` : Whether to output the versions of all dependencies instead of only the outdated ones.

### Results
The plug-in adds the following properties to the `file` object:

```js
file.david = {
  dependencies: {}, // Details about the required dependencies needing an update.
  devDependencies: {}, // Details about the development dependencies needing an update.
  optionalDependencies: {} // Details about the optional dependencies needing an update.
};
```

## Reporters
By default, the plug-in prints to the standard output the list of outdated packages.
You can disable this output by setting the `reporter` option to `false`.

```js
const {david} = require('@cedx/gulp-david');
const {src, task} = require('gulp');

task('checkDependencies', () =>
  src('package.json').pipe(david({reporter: false}))
);
```

You can also replace this reporter by your own implementation.
Look at the source of the [built-in reporter](https://github.com/cedx/gulp-david/blob/master/src/reporter.ts) for a code sample.

```js
const {david} = require('@cedx/gulp-david');
const {src, task} = require('gulp');

task('checkDependencies', () =>
  src('package.json').pipe(david({reporter: new MyReporter}))
);
```

## Updating dependencies
The plug-in lets you update dependencies in the manifest file to latest versions and save them back to the file system:

```js
const {david} = require('@cedx/gulp-david');
const {dest, src, task} = require('gulp');

task('updateDependencies', () => src('package.json')
  .pipe(david({update: true}))
  .pipe(dest('.'))
);
```

By default, the plug-in will use the caret operator (e.g. `^`) to specifiy the version comparators in the manifest file.
You can use a different operator by providing a string indicating the wanted one:

```js
gulp.src('package.json').pipe(david({update: '~'}));
gulp.src('package.json').pipe(david({update: '>='}));
```

In order to pin your dependencies, just use the equality operator:

```js
const {david} = require('@cedx/gulp-david');
const {src, task} = require('gulp');

task('updateDependencies', () =>
  src('package.json').pipe(david({update: '='}))
);
```

## Examples
You can find a more detailled sample in the `example` folder:  
[Sample Gulp tasks](https://github.com/cedx/gulp-david/blob/master/example/gulpfile.js)
