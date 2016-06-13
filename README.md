# Gulp-David
![Release](https://img.shields.io/npm/v/gulp-david.svg) ![License](https://img.shields.io/npm/l/gulp-david.svg) ![Downloads](https://img.shields.io/npm/dm/gulp-david.svg) ![Dependencies](https://img.shields.io/david/cedx/gulp-david.svg) ![Code quality](https://img.shields.io/codacy/grade/5d594024eec24f20b4ba43175e8f5b69.svg) ![Build](https://img.shields.io/travis/cedx/gulp-david.svg)

Check your [NPM](https://www.npmjs.com) dependencies with the [David](https://david-dm.org) plugin for [Gulp.js](http://gulpjs.com), the streaming build system.

## Getting Started
If you haven't used [Gulp.js](http://gulpjs.com) before, be sure to check out the [related documentation](https://github.com/gulpjs/gulp/blob/master/docs/README.md), as it explains how to create a `gulpfile.js` as well as install and use plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
$ npm install --save-dev gulp-david
```

Once the plugin has been installed, it may be enabled inside your `gulpfile.js` with these [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) statements:

```javascript
const gulp = require('gulp');
const david = require('gulp-david');

gulp.task('checkDependencies', () => gulp.src('package.json')
  .pipe(david()).on('error', function(err) {
    console.error(err);
    this.emit('end');
  })
);

```

## Options
The plugin can be customized using these settings:

- `error404: Boolean = false` : If dependency not found, emit an error.
- `errorDepCount: Number = 0` : If greater than `0`, emit an error when the count of outdated dependencies equals or exceeds the specified value.
- `errorDepType: Boolean = false` : If dependency version is invalid (not a string), emit an error.
- `errorSCM: Boolean = false` : If dependency version is a source control URL, emit an error.
- `ignore: Array = []`: Ignore the specified dependencies.
- `registry: String = null` : The [npm](https://www.npmjs.com) registry URL. Uses [registry.npmjs.org](https://registry.npmjs.org) if `null`.
- `reporter: Boolean|Object = true`: Whether a report should be printed to the standard output. If it is an object, it will be used as reporter.
- `unstable: Boolean = false` : Use unstable dependencies.
- `update: Boolean|String = false` : Whether to update dependencies in the file contents to latest versions. If it is a string, it will be used as the operator in version comparators.

## Results
The plugin adds the following properties to the `file` object:

```javascript
file.david = {
  dependencies: {}, // Details about the required dependencies needing an update.
  devDependencies: {}, // Details about the development dependencies needing an update.
  optionalDependencies: {} // Details about the optional dependencies needing an update.
};
```

## Reporters
By default, the plugin prints to the standard output the list of outdated packages.
You can disable this output by setting the `reporter` option to `false`.

```javascript
return gulp.src('package.json')
  .pipe(david({ reporter: false }));
```

You can also replace this reporter by your own implementation.
Look at the source of the [built-in reporter](https://github.com/cedx/gulp-david/blob/master/lib/reporter.js) for a code sample.

```javascript
return gulp.src('package.json')
  .pipe(david({ reporter: new MyReporter() }));
```

## Updating Dependencies
The plugin lets you update dependencies in the manifest file to latest versions and save them back to the file system:

```javascript
return gulp.src('package.json')
  .pipe(david({ update: true }))
  .pipe(gulp.dest('.'));
```

By default, the plugin will use the caret operator (e.g. `^`) to specifiy the version comparators in the manifest file.
You can use a different operator by providing a string indicating the wanted one:

```javascript
gulp.src('package.json').pipe(david({ update: '~' }));
gulp.src('package.json').pipe(david({ update: '>=' }));
```

In order to pin your dependencies, just use the equality operator:

```javascript
gulp.src('package.json').pipe(david({ update: '=' }));
```

## See Also
- [API Reference](http://dev.belin.io/gulp-david)
- [Code Quality](https://www.codacy.com/app/cedx/gulp-david)
- [Continuous Integration](https://travis-ci.org/cedx/gulp-david)

A full sample is located in the `example` folder:  
[Sample Gulp Tasks](https://github.com/cedx/gulp-david/blob/master/example/gulpfile.js)

## License
[Gulp-David](https://github.com/cedx/gulp-david) is distributed under the Apache License, version 2.0.
