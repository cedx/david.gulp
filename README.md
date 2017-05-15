# Gulp-David
![Runtime](https://img.shields.io/badge/node-%3E%3D7.6-brightgreen.svg) ![Release](https://img.shields.io/npm/v/@cedx/gulp-david.svg) ![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg) ![Downloads](https://img.shields.io/npm/dt/@cedx/gulp-david.svg) ![Dependencies](https://david-dm.org/cedx/gulp-david.svg) ![Coverage](https://coveralls.io/repos/github/cedx/gulp-david/badge.svg) ![Build](https://travis-ci.org/cedx/gulp-david.svg)

Check your [npm](https://www.npmjs.com) dependencies with the [David](https://david-dm.org) plug-in for [Gulp.js](http://gulpjs.com), the streaming build system.

## Getting started
If you haven't used [Gulp.js](http://gulpjs.com) before, be sure to check out the [related documentation](https://github.com/gulpjs/gulp/blob/master/docs/README.md), as it explains how to create a `gulpfile.js` as well as install and use plug-ins. Once you're familiar with that process, you may install this plug-in with this command:

```shell
$ npm install --save-dev @cedx/gulp-david
```

Once the plug-in has been installed, it may be enabled inside your `gulpfile.js` with these [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) statements:

```javascript
const gulp = require('gulp');
const {david} = require('@cedx/gulp-david');

gulp.task('checkDependencies', () => gulp.src('package.json')
  .pipe(david()).on('error', function(err) {
    console.error(err);
    this.emit('end');
  })
);

```

## Options
The plug-in can be customized using these settings:

- `error404: boolean = false` : If dependency not found, emit an error.
- `errorDepCount: number = 0` : If greater than `0`, emit an error when the count of outdated dependencies equals or exceeds the specified value.
- `errorDepType: boolean = false` : If dependency version is invalid (not a string), emit an error.
- `errorSCM: boolean = false` : If dependency version is a source control URL, emit an error.
- `ignore: Array = []`: Ignore the specified dependencies.
- `registry: string = ""` : The [npm](https://www.npmjs.com) registry URL. Uses [registry.npmjs.org](https://registry.npmjs.org) if empty.
- `reporter: boolean|object = true`: Whether a report should be printed to the standard output. If it is an object, it will be used as reporter.
- `unstable: boolean = false` : Use unstable dependencies.
- `update: boolean|string = false` : Whether to update dependencies in the file contents to latest versions. If it is a string, it will be used as the operator in version comparators.
- `verbose: boolean = false` : Whether to output the versions of all dependencies instead of only the outdated ones.

## Results
The plug-in adds the following properties to the `file` object:

```javascript
file.david = {
  dependencies: {}, // Details about the required dependencies needing an update.
  devDependencies: {}, // Details about the development dependencies needing an update.
  optionalDependencies: {} // Details about the optional dependencies needing an update.
};
```

## Reporters
By default, the plug-in prints to the standard output the list of outdated packages.
You can disable this output by setting the `reporter` option to `false`.

```javascript
return gulp.src('package.json')
  .pipe(david({reporter: false}));
```

You can also replace this reporter by your own implementation.
Look at the source of the [built-in reporter](https://github.com/cedx/gulp-david/blob/master/src/reporter.js) for a code sample.

```javascript
return gulp.src('package.json')
  .pipe(david({reporter: new MyReporter}));
```

## Updating dependencies
The plug-in lets you update dependencies in the manifest file to latest versions and save them back to the file system:

```javascript
return gulp.src('package.json')
  .pipe(david({update: true}))
  .pipe(gulp.dest('.'));
```

By default, the plug-in will use the caret operator (e.g. `^`) to specifiy the version comparators in the manifest file.
You can use a different operator by providing a string indicating the wanted one:

```javascript
gulp.src('package.json').pipe(david({update: '~'}));
gulp.src('package.json').pipe(david({update: '>='}));
```

In order to pin your dependencies, just use the equality operator:

```javascript
gulp.src('package.json').pipe(david({update: '='}));
```

## Examples
You can find a more detailled sample in the `example` folder:  
[Sample Gulp tasks](https://github.com/cedx/gulp-david/blob/master/example/gulpfile.js)

## See also
- [API reference](https://cedx.github.io/gulp-david)
- [Code coverage](https://coveralls.io/github/cedx/gulp-david)
- [Continuous integration](https://travis-ci.org/cedx/gulp-david)

## License
[Gulp-David](https://github.com/cedx/gulp-david) is distributed under the Apache License, version 2.0.
