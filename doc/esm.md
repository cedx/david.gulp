path: blob/master
source: example/gulpfile.esm.js

# ESM Upgrade Path
As of version 13, this plug-in uses the syntax of [ECMAScript modules](https://nodejs.org/api/esm.html). This is a major change: your [Gulp](https://gulpjs.com) script will not work as usual.
 
If you don't modify it, you will see this kind of errors:

```
SyntaxError: Unexpected token {
```

You have 2 choices:

- continue to use version 12: as long as ES modules are marked as experimental, this is the recommended solution.
- port your Gulp script to ES modules.

If you choose the second option, here are the steps to follow.

## Install the `esm` package
Gulp does not natively support ES modules, but it is able to work with them thanks to the [`esm` package](https://www.npmjs.com/package/esm). Modify your project to add this additional dependency:

```shell
npm install --save-dev esm
```

## Rewrite your Gulp script
In order for Gulp to recognize that you are using ES modules, you must rename your `gulpfile.js` file to` gulpfile.esm.js`.

Then, all you have to do is rewrite the `require` statements as `import` ones.

```js
// Before: CommonJS syntax.
const gulp = require('gulp');
const {david} = require('@cedx/gulp-david');

// After: ESM syntax.
import gulp from 'gulp';
import {david} from '@cedx/gulp-david';
```

That's it!
