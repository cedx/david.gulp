# Changelog

## Version [14.0.0](https://git.belin.io/cedx/gulp-david/compare/v13.2.0...v14.0.0)
- Breaking change: raised the required [Node.js](https://nodejs.org) version.
- Dropped support for [GitHub Packages](https://github.com/features/packages).
- Updated the documentation.
- Updated the package dependencies.

## Version [13.2.0](https://git.belin.io/cedx/gulp-david/compare/v13.1.0...v13.2.0)
- Updated the package dependencies.

## Version [13.1.0](https://git.belin.io/cedx/gulp-david/compare/v13.0.0...v13.1.0)
- Fixed the [issue #16](https://git.belin.io/cedx/gulp-david/issues/16): only the "default export" is supported for CommonJS files or packages.
- Updated the package dependencies.

## Version [13.0.0](https://git.belin.io/cedx/gulp-david/compare/v12.0.0...v13.0.0)
- Breaking change: dropped support for [CommonJS modules](https://nodejs.org/api/modules.html).
- Breaking change: extracted the `Checker.factory()` method into the `david()` function.
- Breaking change: ported the source code to [TypeScript](https://www.typescriptlang.org).
- Breaking change: raised the required [Node.js](https://nodejs.org) version.
- Breaking change: renamed the `Reporter` class to `ConsoleReporter`.
- Added support for [ECMAScript modules](https://nodejs.org/api/esm.html).
- Replaced the [ESDoc](https://esdoc.org) documentation generator by [TypeDoc](https://typedoc.org).
- Updated the package dependencies.

## Version [12.0.0](https://git.belin.io/cedx/gulp-david/compare/v11.0.0...v12.0.0)
- Breaking change: raised the required [Node.js](https://nodejs.org) version.
- Added a user guide based on [MkDocs](http://www.mkdocs.org).
- Using the global `URL` class.
- Updated the build system to [Gulp](https://gulpjs.com) version 4.
- Updated the package dependencies.

## Version [11.0.0](https://git.belin.io/cedx/gulp-david/compare/v10.0.0...v11.0.0)
- Breaking change: changed the signature of the `Checker` constructor.
- Updated the package dependencies.

## Version [10.0.0](https://git.belin.io/cedx/gulp-david/compare/v9.0.0...v10.0.0)
- Breaking change: converted the [`Observable`](http://reactivex.io/intro.html)-based API to an `async/await`-based one.
- Added the [`[Symbol.toStringTag]`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toStringTag) property to all classes.
- Changed licensing for the [MIT License](https://opensource.org/licenses/MIT).

## Version [9.0.0](https://git.belin.io/cedx/gulp-david/compare/v8.1.0...v9.0.0)
- Breaking change: changed the `factory()` function to the `Checker.factory()` method.
- Updated the package dependencies.

## Version [8.1.0](https://git.belin.io/cedx/gulp-david/compare/v8.0.0...v8.1.0)
- Removed the dependency on [Babel](https://babeljs.io) compiler.
- Updated the package dependencies.

## Version [8.0.0](https://git.belin.io/cedx/gulp-david/compare/v7.0.1...v8.0.0)
- Breaking change: restored the [Observable](http://reactivex.io/intro.html) APIs.
- Updated the package dependencies.

## Version [7.0.1](https://git.belin.io/cedx/gulp-david/compare/v7.0.0...v7.0.1)
- Fixed a code generation bug.
- Updated the package dependencies.

## Version [7.0.0](https://git.belin.io/cedx/gulp-david/compare/v6.3.0...v7.0.0)
- Breaking change: raised the required [Node.js](https://nodejs.org) version.
- Breaking change: the `Checker.registry` property is now an instance of the [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL) class.
- Updated the package dependencies.

## Version [6.3.0](https://git.belin.io/cedx/gulp-david/compare/v6.2.0...v6.3.0)
- Added support for the [Node Security Platform](https://nodesecurity.io) reports.

## Version [6.2.0](https://git.belin.io/cedx/gulp-david/compare/v6.1.0...v6.2.0)
- Updated the package dependencies.

## Version [6.1.0](https://git.belin.io/cedx/gulp-david/compare/v6.0.0...v6.1.0)
- Updated the package dependencies.

## Version [6.0.0](https://git.belin.io/cedx/gulp-david/compare/v5.0.0...v6.0.0)
- Breaking change: changed the signature of the `Checker` constructor.
- Checker options are now exposed as public properties.
- Turned the `Checker._transform()` method into an async function.

## Version [5.0.0](https://git.belin.io/cedx/gulp-david/compare/v4.1.0...v5.0.0)
- Breaking change: raised the required [Node.js](https://nodejs.org) version.
- Breaking change: using ES2017 features, like async/await functions.
- Improved the build system.
- Ported the unit test assertions from [TDD](https://en.wikipedia.org/wiki/Test-driven_development) to [BDD](https://en.wikipedia.org/wiki/Behavior-driven_development).
- Updated the package dependencies.

## Version [4.1.0](https://git.belin.io/cedx/gulp-david/compare/v4.0.0...v4.1.0)
- Backported the non-breaking changes from versions 5 and 6: feature request from [issue #14](https://git.belin.io/cedx/gulp-david/issues/14).
- Updated the package dependencies.

## Version [4.0.0](https://git.belin.io/cedx/gulp-david/compare/v3.1.0...v4.0.0)
- Breaking change: dropped the dependency on [Observables](http://reactivex.io/intro.html).
- Updated the package dependencies.

## Version [3.1.0](https://git.belin.io/cedx/gulp-david/compare/v3.0.2...v3.1.0)
- Replaced the [Codacy](https://www.codacy.com) code coverage service by the [Coveralls](https://coveralls.io) one.
- Updated the package dependencies.

## Version [3.0.2](https://git.belin.io/cedx/gulp-david/compare/v3.0.1...v3.0.2)
- Fixed the [issue #11](https://git.belin.io/cedx/gulp-david/issues/11).

## Version [3.0.1](https://git.belin.io/cedx/gulp-david/compare/v3.0.0...v3.0.1)
- Updated the package dependencies.

## Version [3.0.0](https://git.belin.io/cedx/gulp-david/compare/v2.0.4...v3.0.0)
- Breaking change: the plug-in is not anymore a default export. The use of destructuring assignment is advised to access it.
- Breaking change: ported the [CommonJS modules](https://nodejs.org/api/modules.html) to ES2015 format.
- Breaking change: ported the [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)-based APIs to [Observables](http://reactivex.io/intro.html).
- Breaking change: raised the required [Node.js](https://nodejs.org) version.
- Breaking change: replaced the test classes by plain tests.
- Added a build task for fixing the coding standards issues.
- Added the `verbose` option.
- Replaced the [JSDoc](http://usejsdoc.org) documentation generator by [ESDoc](https://esdoc.org).
- Replaced the [JSHint](http://jshint.com) linter by [ESLint](http://eslint.org).
- Updated the package dependencies.

## Version [2.0.4](https://git.belin.io/cedx/gulp-david/compare/v2.0.3...v2.0.4)
- Updated the [David](https://david-dm.org) dependency to its latest version.

## Version [2.0.3](https://git.belin.io/cedx/gulp-david/compare/v2.0.2...v2.0.3)
- Fixed the name of the [JSDoc](http://usejsdoc.org) configuration file.
- Replaced some deprecated method calls of the `Buffer` class.
- Updated the package dependencies.

## Version [2.0.2](https://git.belin.io/cedx/gulp-david/compare/v2.0.1...v2.0.2)
- Updated the [David](https://david-dm.org) dependency to its latest version.

## Version [2.0.1](https://git.belin.io/cedx/gulp-david/compare/v2.0.0...v2.0.1)
- Raised the required [Node.js](https://nodejs.org) version to reflect the latest breaking changes.

## Version [2.0.0](https://git.belin.io/cedx/gulp-david/compare/v1.0.0...v2.0.0)
- Breaking change: using more ES2015 features, like default parameters and destructuring assignment.
- Turned the package into a [scoped one](https://docs.npmjs.com/getting-started/scoped-packages).
- Improved the code coverage.

## Version [1.0.0](https://git.belin.io/cedx/gulp-david/compare/v0.4.3...v1.0.0)
- First stable release.
- Replaced the [SonarQube](http://www.sonarqube.org) code analyzer by [Codacy](https://www.codacy.com) service.

## Version [0.4.3](https://git.belin.io/cedx/gulp-david/compare/v0.4.2...v0.4.3)
- Fixed some bugs.
- Updated the package dependencies.

## Version [0.4.2](https://git.belin.io/cedx/gulp-david/compare/v0.4.1...v0.4.2)
- Implemented the [request #9](https://git.belin.io/cedx/gulp-david/issues/9): allow other operators than the caret in manifest updates.
- Updated the package dependencies.

## Version [0.4.1](https://git.belin.io/cedx/gulp-david/compare/v0.3.4...v0.4.1)
- Implemented the [request #6](https://git.belin.io/cedx/gulp-david/issues/6): merge the reporting feature into the main transformer.
- Breaking change: the report transformer is replaced by a logger.
- Updated the package dependencies.

## Version [0.3.4](https://git.belin.io/cedx/gulp-david/compare/v0.3.3...v0.3.4)
- Added support for code coverage.

## Version [0.3.3](https://git.belin.io/cedx/gulp-david/compare/v0.3.2...v0.3.3)
- Implemented the [request #3](https://git.belin.io/cedx/gulp-david/issues/3): added an `errorDepCount` option to the checker.

## Version [0.3.2](https://git.belin.io/cedx/gulp-david/compare/v0.3.1...v0.3.2)
- Changed licensing for the [Apache License Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).

## Version [0.3.1](https://git.belin.io/cedx/gulp-david/compare/v0.3.0...v0.3.1)
- Added support for [SonarQube](http://www.sonarqube.org) code analyzer.
- Updated the sample `gulpfile.js`.

## Version [0.3.0](https://git.belin.io/cedx/gulp-david/compare/v0.2.3...v0.3.0)
- Breaking change: using ES2015 features, like arrow functions, block-scoped binding constructs, classes and template strings.
- Breaking change: raised the required [Node.js](http://nodejs.org) version.
- Added the `ignore` option to the checker.
- Added support for [Travis CI](https://travis-ci.com) continuous integration.
- Changed the documentation system for [JSDoc](http://usejsdoc.org).
- Updated the package dependencies.

## Version [0.2.3](https://git.belin.io/cedx/gulp-david/compare/v0.2.2...v0.2.3)
- Updated the package dependencies.

## Version [0.2.2](https://git.belin.io/cedx/gulp-david/compare/v0.2.1...v0.2.2)
- Updated the package dependencies.

## Version [0.2.1](https://git.belin.io/cedx/gulp-david/compare/v0.2.0...v0.2.1)
- Updated the package dependencies.

## Version [0.2.0](https://git.belin.io/cedx/gulp-david/compare/v0.1.1...v0.2.0)
- Breaking change: raised the required [Node.js](http://nodejs.org) version.
- Breaking change: removed the dependency on [`promise`](https://www.npmjs.com/package/promise) module.
- Updated the package dependencies.

## Version [0.1.1](https://git.belin.io/cedx/gulp-david/compare/v0.1.0...v0.1.1)
- Added a sample `gulpfile.js`.
- Added unit tests.

## Version 0.1.0
- Initial release.
