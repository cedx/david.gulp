path: blob/master
source: example/gulpfile.esm.js

# ESM Upgrade Path for JavaScript
If you use a `gulpfile.js` script, you will need to:

- Add support for ES modules.
- Rewrite the `require` statements.

## Install the `esm` package
Gulp does not natively support ES modules, but it is able to work with them thanks to the [`esm` package](https://www.npmjs.com/package/esm). Modify your project to add this additional dependency:

```shell
npm install --save-dev esm
```

## Rewrite your Gulp script
In order for Gulp to recognize that you are using ES modules, you must rename your `gulpfile.js` file to` gulpfile.esm.js`.

Then, all you have to do is to rewrite the `require` statements as `import` ones:

```js
// Before: CommonJS syntax.
const gulp = require('gulp');
const {david} = require('@cedx/gulp-david');

// After: ESM syntax.
import gulp from 'gulp';
import {david} from '@cedx/gulp-david';
```

That's it!