'use strict';
const {series, src, task} = require('gulp');

let david;
task('david:import', () => import('../lib/index.js').then(mod => david = mod.david));
task('david:run', () => src('../package.json').pipe(david()));
task('default', series('david:import', 'david:run'));
