# David.gulp
[![Version](http://img.shields.io/npm/v/gulp-david.svg?style=flat)](https://www.npmjs.com/package/gulp-david) [![Dependencies](http://img.shields.io/david/cedx/david.gulp.svg?style=flat)](https://david-dm.org/cedx/david.gulp) [![Downloads](http://img.shields.io/npm/dm/gulp-david.svg?style=flat)](https://www.npmjs.com/package/gulp-david) [![License](http://img.shields.io/npm/l/gulp-david.svg?style=flat)](https://github.com/cedx/david.gulp/blob/master/LICENSE.txt)

Check your [NPM](https://www.npmjs.com) dependencies with the [David](https://david-dm.org) plugin for [Gulp.js](http://gulpjs.com), the streaming build system.

## Getting Started
If you haven't used [Gulp.js](http://gulpjs.com) before, be sure to check out the [related documentation](https://github.com/gulpjs/gulp/blob/master/docs/README.md), as it explains how to create a `gulpfile.js` as well as install and use plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
$ npm install david-gulp --save-dev
```

Once the plugin has been installed, it may be enabled inside your `gulpfile.js` with these [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) statements:

```javascript
var david = require('david-gulp');
gulp.task('checkDependencies', function() {
  return gulp.src('package.json')
    .pipe(david());
});

```

## Options
The plugin can be customized using these settings:
- `error404: Boolean = false` : If dependency not found, emit an error.
- `errorDepType: Boolean = false` : If dependency version is invalid (not a string), emit an error.
- `errorSCM: Boolean = false` : If dependency version is a source control URL, emit an error.
- `registry: String = null` : The NPM registry URL. Uses [registry.npmjs.org](https://registry.npmjs.org) if `null`.
- `update: Boolean = false` : Update dependencies in the file contents to latest versions.
- `unstable: Boolean = false` : Use unstable dependencies.

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
The plugin provides a builtin reporter printing to the standard ouput the list of packages that need to be updated.

```javascript
return gulp.src('package.json')
  .pipe(david())
  .pipe(david.reporter);
```

## Updating Dependencies
This plugin let you update dependencies in the manifest file to latest versions and save them back:

```javascript
return gulp.src('package.json')
  .pipe(david({ update: true }))
  .pipe(gulp.dest('.'));
```

## License
[David.gulp](https://www.npmjs.com/package/david-gulp) is distributed under the MIT License.
