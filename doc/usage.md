# Usage
If you haven't used [Gulp](https://gulpjs.com) before, be sure to check out the [related documentation](https://gulpjs.com/docs/en/getting-started/quick-start), as it explains how to create a `gulpfile.js`, as well as install and use plug-ins.
Once you're familiar with that process, you may install the plug-in.

## Requirements
As of version 13, this plug-in uses the syntax of [ECMAScript modules](https://nodejs.org/api/esm.html). This is a major change: your Gulp script will probably not work as usual.
 
If you don't modify it, you can encounter this kind of errors:

```
SyntaxError: Unexpected token {
```

You have two possibles choices:

- Continue to use version 12: as long as ES modules are marked as experimental, this is the recommended solution.
- Upgrade your Gulp script to use ES modules.

If you choose the second option, you must load this package using an [`import` expression](https://nodejs.org/api/esm.html#esm_import_expressions), because Gulp still does not natively support ES modules:

```js
const {series, src, task} = require('gulp');

let david;
task('david:import', () => import('@cedx/gulp-david').then(mod => david = mod.david));
task('david:run', () => src('package.json').pipe(david()));
task('david', series('david:import', 'david:run'));

```

## Programming interface
The plug-in takes a [`package.json`](https://docs.npmjs.com/files/package.json) file as input, and scans its dependencies to check whether any one is outdated:

```js
import {david} from '@cedx/gulp-david';
import gulp from 'gulp';

gulp.task('checkDependencies', () => gulp.src('package.json')
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
- **registry**: string|URL = `"https://registry.npmjs.org/"` : The [npm](https://www.npmjs.com) registry URL.
- **reporter**: boolean|Reporter = `true`: Whether a report should be printed to the standard output. If it is an object, it will be used as reporter.
- **unstable**: boolean = `false` : Use unstable dependencies.
- **update**: boolean|string = `false` : Whether to update dependencies in the file contents to latest versions. If it is a string, it will be used as the operator in version comparators.
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
import {david} from '@cedx/gulp-david';
import gulp from 'gulp';

gulp.task('checkDependencies', () =>
  gulp.src('package.json').pipe(david({reporter: false}))
);
```

You can also replace this reporter by your own implementation.
Look at the source of the [built-in reporter](https://github.com/cedx/gulp-david/blob/master/src/reporter.ts) for a code sample.

```js
import {david} from '@cedx/gulp-david';
import gulp from 'gulp';

gulp.task('checkDependencies', () =>
  gulp.src('package.json').pipe(david({reporter: new MyReporter}))
);
```

## Updating dependencies
The plug-in lets you update dependencies in the manifest file to latest versions and save them back to the file system:

```js
import {david} from '@cedx/gulp-david';
import gulp from 'gulp';

gulp.task('updateDependencies', () => gulp.src('package.json')
  .pipe(david({update: true}))
  .pipe(gulp.dest('.'))
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
import {david} from '@cedx/gulp-david';
import gulp from 'gulp';

gulp.task('updateDependencies', () =>
  gulp.src('package.json').pipe(david({update: '='}))
);
```

## Examples
You can find a more detailled sample in the `example` folder:  
[Sample Gulp tasks](https://github.com/cedx/gulp-david/blob/master/example/gulpfile.js)
