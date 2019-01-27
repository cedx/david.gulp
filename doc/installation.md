# Installation

## Requirements
Before installing **Gulp-David**, you need to make sure you have [Node.js](https://nodejs.org)
and [npm](https://www.npmjs.com), the Node.js package manager, up and running.

!!! warning
    Gulp-David requires Node.js >= **10.15.0**.
    
You can verify if you're already good to go with the following commands:

```shell
node --version
# v10.15.0

npm --version
# 6.5.0
```

!!! info
    If you plan to play with the package sources, you will also need
    [Gulp](https://gulpjs.com) and [Material for MkDocs](https://squidfunk.github.io/mkdocs-material).

## Installing with npm package manager

### 1. Install it
From a command prompt, run:

```shell
npm install @cedx/gulp-david
```

### 2. Import it
Now in your [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) or [TypeScript](https://www.typescriptlang.org) code, you can use:

```js
const david = require('@cedx/gulp-david');
```

!!! info
    This library is packaged as [CommonJS modules](https://nodejs.org/api/modules.html) (`.js` files)
    and [ECMAScript modules](https://nodejs.org/api/esm.html) (`.mjs` files).
