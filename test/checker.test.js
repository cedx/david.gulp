import assert from 'assert';
import {Checker} from '../src/checker';
import File from 'vinyl';
import {Observable} from 'rxjs';
import * as pkg from '../package.json';
import stream from 'stream';

/**
 * @test {Checker}
 */
describe('Checker', function() {
  this.timeout(15000);

  /**
   * @test {Checker#constructor}
   */
  describe('#constructor()', () => {
    it('should properly handle the options', () =>
      assert.equal(new Checker({errorDepCount: 5, reporter: false})._options.errorDepCount, 5)
    );

    it('should have a reporter if the property is not false', () =>
      assert(typeof new Checker({reporter: {}})._options.reporter == 'object')
    );
  });

  /**
   * @test {Checker#getDependencies}
   */
  describe('#getDependencies()', () => {
    it('should return an Observable object', () =>
      assert(new Checker({reporter: false}).getDependencies({}) instanceof Observable)
    );

    it('should return an object with 3 dependency properties', () =>
      new Checker({reporter: false}).getDependencies({name: '@cedx/gulp-david'}).then(deps => {
        assert('dependencies' in deps);
        assert('devDependencies' in deps);
        assert('optionalDependencies' in deps);
      })
    );

    it('should have some non-empty dependency properties for the current manifest', () =>
      new Checker({reporter: false}).getDependencies(pkg).then(deps => {
        assert(Object.keys(deps.dependencies).length > 0);
        assert(Object.keys(deps.devDependencies).length > 0);
        assert(!Object.keys(deps.optionalDependencies).length);
      })
    );
  });

  /**
   * @test {Checker#getUpdatedDependencies}
   */
  describe('#getUpdatedDependencies()', () => {
    it('should return an Observable object', () =>
      assert(new Checker({reporter: false}).getUpdatedDependencies({}) instanceof Observable)
    );

    it('should return an object with 3 dependency properties', () =>
      new Checker({reporter: false}).getUpdatedDependencies({name: '@cedx/gulp-david'}).then(deps => {
        assert('dependencies' in deps);
        assert('devDependencies' in deps);
        assert('optionalDependencies' in deps);
      })
    );

    it('should have some empty dependency properties for the current manifest', () =>
      new Checker({reporter: false}).getUpdatedDependencies(pkg).then(deps => {
        assert(!Object.keys(deps.optionalDependencies).length);
      })
    );
  });

  /**
   * @test {Checker#parseManifest}
   */
  describe('#parseManifest()', () => {
    it('should throw an error if the file is null', () =>
      assert.throws(() => new Checker({reporter: false}).parseManifest(new File()))
    );

    it('should throw an error if the file is a stream', () =>
      assert.throws(() => {
        let file = new File({contents: new stream.Readable()});
        new Checker({reporter: false}).parseManifest(file);
      })
    );

    it('should throw an error if the manifest is invalid', () =>
      assert.throws(() => {
        let file = new File({contents: Buffer.from('FooBar')});
        new Checker({reporter: false}).parseManifest(file);
      })
    );

    it('should return an object if the manifest is valid', () => {
      let file = new File({contents: Buffer.from('{"name": "@cedx/gulp-david"}')});
      assert.deepEqual(new Checker({reporter: false}).parseManifest(file), {name: '@cedx/gulp-david'});
    });
  });

  /**
   * @test {Checker#_transform}
   */
  describe('#_transform()', () => {
    it('should return an error if the manifest is invalid', done => {
      let src = new File({contents: Buffer.from('FooBar')});
      new Checker({reporter: false})._transform(src, 'utf8', (err, dest) => {
        assert(err instanceof Error);
        assert(typeof dest == 'undefined');
        done();
      });
    });

    it('should add a "david" property to the file object', done => {
      let src = new File({contents: Buffer.from('{"name": "@cedx/gulp-david"}')});
      new Checker({reporter: false})._transform(src, 'utf8', (err, dest) => {
        assert.ifError(err);
        assert('david' in dest);
        done();
      });
    });
  });
});
