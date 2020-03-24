import {strict as assert} from 'assert';
import {readFileSync} from 'fs';
import {Readable} from 'stream';
import File from 'vinyl';
import {Checker} from '../lib/index.js';

/** Tests the features of the {@link Checker} class. */
describe('Checker', function() {
  this.timeout(15000);
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));

  describe('.getDependencies()', () => {
    it('should return an object with 3 dependency properties', async () => {
      const keys = Object.keys(await new Checker().getDependencies({name: '@cedx/gulp-david'}));
      assert(keys.includes('dependencies'));
      assert(keys.includes('devDependencies'));
      assert(keys.includes('optionalDependencies'));
    });

    it('should have some non-empty dependencies for the current manifest', async () => {
      const deps = await new Checker().getDependencies(pkg);
      assert(Object.keys(deps.dependencies).length > 0);
      assert(Object.keys(deps.devDependencies).length > 0);
    });

    it('should not have optional dependencies for the current manifest', async () => {
      const deps = await new Checker().getDependencies(pkg);
      assert.equal(Object.keys(deps.optionalDependencies).length, 0);
    });
  });

  describe('.getUpdatedDependencies()', () => {
    it('should return an object with 3 dependency properties', async () => {
      const keys = Object.keys(await new Checker().getUpdatedDependencies({name: '@cedx/gulp-david'}));
      assert(keys.includes('dependencies'));
      assert(keys.includes('devDependencies'));
      assert(keys.includes('optionalDependencies'));
    });

    it('should not have optional dependencies for the current manifest', async () => {
      const deps = await new Checker().getUpdatedDependencies(pkg);
      assert.equal(Object.keys(deps.optionalDependencies).length, 0);
    });
  });

  describe('.parseManifest()', () => {
    it('should throw an error if the file is null', () => {
      assert.throws(() => new Checker().parseManifest(new File));
    });

    it('should throw an error if the file is a stream', () => {
      assert.throws(() => new Checker().parseManifest(new File({contents: new Readable})));
    });

    it('should throw an error if the manifest is invalid', () => {
      assert.throws(() => new Checker().parseManifest(new File({contents: Buffer.from('FooBar')})));
    });

    it('should return an object if the manifest is valid', () => {
      const file = new File({contents: Buffer.from('{"name": "@cedx/gulp-david"}')});
      assert.deepEqual(new Checker().parseManifest(file), {name: '@cedx/gulp-david'});
    });
  });

  describe('._transform()', () => {
    it('should rejects if the manifest is invalid', () => {
      const input = new File({contents: Buffer.from('FooBar')});
      assert.rejects(new Checker()._transform(input));
    });

    it('should add a "david" property to the file object', async () => {
      const input = new File({contents: Buffer.from('{"name": "@cedx/gulp-david"}')});
      const file = await new Checker()._transform(input);
      assert.ok(file.david);
      assert.equal(typeof file.david, 'object');
    });
  });
});
