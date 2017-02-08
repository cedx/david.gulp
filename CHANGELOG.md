# Changelog
This file contains highlights of what changes on each version of the [Gulp-David](https://github.com/cedx/gulp-david) package.

## Version 4.0.0
- Breaking change: dropped the dependency on [Observables](http://reactivex.io/intro.html).
- Updated the package dependencies.

## Version 3.1.0
- Replaced the [Codacy](https://www.codacy.com) code coverage service by the [Coveralls](https://coveralls.io) one.
- Updated the package dependencies.

## Version 3.0.2
- Fixed the [issue #11](https://github.com/cedx/gulp-david/issues/11).

## Version 3.0.1
- Updated the package dependencies.

## Version 3.0.0
- Breaking change: the plug-in is not anymore a default export. The use of destructuring assignment is advised to access it.
- Breaking change: ported the [CommonJS](https://nodejs.org/api/modules.html) modules to ES2015 format.
- Breaking change: ported the [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)-based APIs to [Observables](http://reactivex.io/intro.html).
- Breaking change: raised the required [Node.js](https://nodejs.org) version.
- Breaking change: replaced the test classes by plain tests.
- Added a build task for fixing the coding standards issues.
- Added the `verbose` option.
- Replaced [JSDoc](http://usejsdoc.org) documentation generator by [ESDoc](https://esdoc.org).
- Replaced [JSHint](http://jshint.com) linter by [ESLint](http://eslint.org).
- Updated the package dependencies.

## Version 2.0.4
- Updated the [David](https://david-dm.org) dependency to its latest version.

## Version 2.0.3
- Fixed the name of the [JSDoc](http://usejsdoc.org) configuration file.
- Replaced some deprecated method calls of the `Buffer` class.
- Updated the package dependencies.

## Version 2.0.2
- Updated the [David](https://david-dm.org) dependency to its latest version.

## Version 2.0.1
- Raised the required [Node.js](https://nodejs.org) version to reflect the latest breaking changes.

## Version 2.0.0
- Breaking change: using more ES2015 features, like default parameters and destructuring assignment.
- Turned the package into a [scoped one](https://docs.npmjs.com/getting-started/scoped-packages).
- Improved the code coverage.

## Version 1.0.0
- First stable release.
- Replaced [SonarQube](http://www.sonarqube.org) code analyzer by [Codacy](https://www.codacy.com) service.

## Version 0.4.3
- Fixed some bugs.
- Updated the package dependencies.

## Version 0.4.2
- Implemented the [request #9](https://github.com/cedx/david.gulp/issues/9): allow other operators than the caret in manifest updates.
- Updated the package dependencies.

## Version 0.4.1
- Implemented the [request #6](https://github.com/cedx/david.gulp/issues/6): merge the reporting feature into the main transformer.
- Breaking change: the report transformer is replaced by a logger.
- Updated the package dependencies.

## Version 0.3.4
- Added support for code coverage.

## Version 0.3.3
- Implemented the [request #3](https://github.com/cedx/david.gulp/issues/3): added an `errorDepCount` option to the checker.

## Version 0.3.2
- Changed licensing for the [Apache License Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).

## Version 0.3.1
- Added support for [SonarQube](http://www.sonarqube.org) code analyzer.
- Updated the sample `gulpfile.js`.

## Version 0.3.0
- Breaking change: using ES2015 features, like arrow functions, block-scoped binding constructs, classes and template strings.
- Breaking change: raised the required [Node.js](http://nodejs.org) version.
- Added the `ignore` option to the checker.
- Added support for [Travis CI](https://travis-ci.org) continuous integration.
- Changed the documentation system for [JSDoc](http://usejsdoc.org).
- Updated the package dependencies.

## Version 0.2.3
- Updated the package dependencies.

## Version 0.2.2
- Updated the package dependencies.

## Version 0.2.1
- Updated the package dependencies.

## Version 0.2.0
- Breaking change: raised the required [Node.js](http://nodejs.org) version.
- Breaking change: removed the dependency on [`promise`](https://www.npmjs.com/package/promise) module.
- Updated the package dependencies.

## Version 0.1.1
- Added a sample `gulpfile.js`.
- Added unit tests.

## Version 0.1.0
- Initial release.
