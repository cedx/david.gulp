'use strict';

import {expect} from 'chai';
import {describe, it} from 'mocha';
import {Readable} from 'stream';
import File from 'vinyl';

import * as pkg from '../package.json';
import {Checker} from '../src/index';

/**
 * @test {Checker}
 */
describe('Checker', function() {
  this.timeout(15000);

  /**
   * @test {Checker#getDependencies}
   */
  describe('#getDependencies()', () => {
    it('should return an object with 3 dependency properties', async () => {
      let deps = await new Checker().getDependencies({name: '@cedx/gulp-david'});
      expect(deps).to.contain.all.keys('dependencies', 'devDependencies', 'optionalDependencies');
    });

    it('should have some non-empty dependency properties for the current manifest', async () => {
      let deps = await new Checker().getDependencies(pkg);
      expect(Object.keys(deps.dependencies)).to.not.be.empty;
      expect(Object.keys(deps.devDependencies)).to.not.be.empty;
      expect(Object.keys(deps.optionalDependencies)).to.be.empty;
    });
  });

  /**
   * @test {Checker#getUpdatedDependencies}
   */
  describe('#getUpdatedDependencies()', () => {
    it('should return an object with 3 dependency properties', async () => {
      let deps = await new Checker().getUpdatedDependencies({name: '@cedx/gulp-david'});
      expect(deps).to.contain.all.keys('dependencies', 'devDependencies', 'optionalDependencies');
    });

    it('should have some empty dependency properties for the current manifest', async () => {
      let deps = await new Checker().getUpdatedDependencies(pkg);
      expect(Object.keys(deps.optionalDependencies)).to.be.empty;
    });
  });

  /**
   * @test {Checker#parseManifest}
   */
  describe('#parseManifest()', () => {
    it('should throw an error if the file is null', () => {
      expect(() => new Checker().parseManifest(new File())).to.throw();
    });

    it('should throw an error if the file is a stream', () => {
      expect(() => {
        let file = new File({contents: new Readable()});
        new Checker().parseManifest(file);
      }).to.throw();
    });

    it('should throw an error if the manifest is invalid', () => {
      expect(() => {
        let file = new File({contents: Buffer.from('FooBar')});
        new Checker().parseManifest(file);
      }).to.throw();
    });

    it('should return an object if the manifest is valid', () => {
      let file = new File({contents: Buffer.from('{"name": "@cedx/gulp-david"}')});
      expect(new Checker().parseManifest(file)).to.deep.equal({name: '@cedx/gulp-david'});
    });
  });

  /**
   * @test {Checker#_transform}
   */
  describe('#_transform()', () => {
    it('should throw an error if the manifest is invalid', async () => {
      try {
        let input = new File({contents: Buffer.from('FooBar')});
        await new Checker()._transform(input, 'utf8');
        expect(true).to.not.be.ok;
      }

      catch (err) {
        expect(true).to.be.ok;
      }
    });

    it('should add a "david" property to the file object', async () => {
      let input = new File({contents: Buffer.from('{"name": "@cedx/gulp-david"}')});
      let output = await new Checker()._transform(input, 'utf8');
      expect(output).to.contain.keys('david');
    });
  });
});
