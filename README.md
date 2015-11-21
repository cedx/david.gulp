# David.gulp
![Release](http://img.shields.io/npm/v/gulp-david.svg) ![License](http://img.shields.io/npm/l/gulp-david.svg) ![Downloads](http://img.shields.io/npm/dm/gulp-david.svg) ![Dependencies](http://img.shields.io/david/cedx/david.gulp.svg) ![Build](http://img.shields.io/travis/cedx/david.gulp.svg)

Check your [NPM](https://www.npmjs.com) dependencies with the [David](https://david-dm.org) plugin for [Gulp.js](http://gulpjs.com), the streaming build system.

## Getting Started
If you haven't used [Gulp.js](http://gulpjs.com) before, be sure to check out the [related documentation](https://github.com/gulpjs/gulp/blob/master/docs/README.md), as it explains how to create a `gulpfile.js` as well as install and use plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
$ npm install gulp-david --save-dev
```

Once the plugin has been installed, it may be enabled inside your `gulpfile.js` with these [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) statements:

```javascript
const gulp = require('gulp');
const david = require('gulp-david');

gulp.task('checkDependencies', () => gulp.src('package.json').pipe(david()));

```

## Options
The plugin can be customized using these settings:

- `error404: Boolean = false` : If dependency not found, emit an error.
- `errorDepCount: Number = 0` : If greater than `0`, emit an error when the count of outdated dependencies exceeds the specified value.
- `errorDepType: Boolean = false` : If dependency version is invalid (not a string), emit an error.
- `errorSCM: Boolean = false` : If dependency version is a source control URL, emit an error.
- `ignore: Array = []`: Ignore the specified dependencies.
- `registry: String = null` : The [npm](https://www.npmjs.com) registry URL. Uses [registry.npmjs.org](https://registry.npmjs.org) if `null`.
- `unstable: Boolean = false` : Use unstable dependencies.
- `update: Boolean = false` : Update dependencies in the file contents to latest versions.

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
The plugin provides a builtin reporter printing to the standard ouput the list of outdated packages:

```javascript
return gulp.src('package.json')
  .pipe(david())
  .pipe(david.reporter);
```

## Updating Dependencies
The plugin lets you update dependencies in the manifest file to latest versions and save them back to the file system:

```javascript
return gulp.src('package.json')
  .pipe(david({ update: true }))
  .pipe(gulp.dest('.'));
```

## See Also
- [API Reference](http://www.belin.io/david.gulp/api)
- [Code Analysis](http://src.belin.io/dashboard/index/david.gulp)
- [Continuous Integration](https://travis-ci.org/cedx/david.gulp)

A full sample is located in the `example` folder:  
[Sample Gulp Tasks](https://github.com/cedx/david.gulp/blob/master/example/gulpfile.js)

## License
[David.gulp](https://github.com/cedx/david.gulp) is distributed under the Apache License, version 2.0.
