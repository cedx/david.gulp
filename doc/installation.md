# Installation

## Requirements
Before installing **Gulp-David**, you need to make sure you have [Node.js](https://nodejs.org) and [npm](https://www.npmjs.com), the Node.js package manager, up and running.
You also need the [Command Line Utility for Gulp](https://www.npmjs.com/package/gulp-cli).

!!! warning
    Gulp-David requires Node.js >= **12.14.0** and Gulp >= **4.0.0**.
   
You can verify if you're already good to go with the following commands:

```shell
node --version
# v13.6.0

npm --version
# 6.13.4

gulp --version
# CLI version: 2.2.0
# Local version: 4.0.2
```

!!! info
    If you plan to play with the package sources, you will also need
    [Material for MkDocs](https://squidfunk.github.io/mkdocs-material).

## Installing with npm package manager

### 1. Install it
From a command prompt, run:

```shell
npm install @cedx/gulp-david
```

### 2. Import it
Now in your [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) or [TypeScript](https://www.typescriptlang.org) code, you can use:

```typescript
import {david} from '@cedx/gulp-david';
```
