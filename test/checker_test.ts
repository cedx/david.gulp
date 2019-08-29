import * as chai from 'chai';
import {Readable} from 'stream';
import File from 'vinyl';
import * as pkg from '../package.json';
import {Checker} from '../src/index';

/** Tests the features of the [[Checker]] class. */
describe('Checker', function() {
  const {expect} = chai;
  this.timeout(15000); // eslint-disable-line no-invalid-this

  describe('#getDependencies()', () => {
    it('should return an object with 3 dependency properties', async () => {
      const deps = await new Checker().getDependencies({name: '@cedx/gulp-david'});
      expect(deps).to.contain.all.keys('dependencies', 'devDependencies', 'optionalDependencies');
    });

    it('should have some non-empty dependencies for the current manifest', async () => {
      const deps = await new Checker().getDependencies(pkg);
      expect(Object.keys(deps.dependencies)).to.not.be.empty;
      expect(Object.keys(deps.devDependencies)).to.not.be.empty;
    });

    it('should not have optional dependencies for the current manifest', async () => {
      const deps = await new Checker().getDependencies(pkg);
      expect(Object.keys(deps.optionalDependencies)).to.be.empty;
    });
  });

  describe('#getUpdatedDependencies()', () => {
    it('should return an object with 3 dependency properties', async () => {
      const deps = await new Checker().getUpdatedDependencies({name: '@cedx/gulp-david'});
      expect(deps).to.contain.all.keys('dependencies', 'devDependencies', 'optionalDependencies');
    });

    it('should not have optional dependencies for the current manifest', async () => {
      const deps = await new Checker().getUpdatedDependencies(pkg);
      expect(Object.keys(deps.optionalDependencies)).to.be.empty;
    });
  });

  describe('#parseManifest()', () => {
    it('should throw an error if the file is null', () => {
      expect(() => new Checker().parseManifest(new File)).to.throw();
    });

    it('should throw an error if the file is a stream', () => {
      expect(() => new Checker().parseManifest(new File({contents: new Readable}))).to.throw();
    });

    it('should throw an error if the manifest is invalid', () => {
      expect(() => new Checker().parseManifest(new File({contents: Buffer.from('FooBar')}))).to.throw();
    });

    it('should return an object if the manifest is valid', () => {
      const file = new File({contents: Buffer.from('{"name": "@cedx/gulp-david"}')});
      expect(new Checker().parseManifest(file)).to.deep.equal({name: '@cedx/gulp-david'});
    });
  });

  describe('#_transform()', () => {
    it('should throw an error if the manifest is invalid', async () => {
      try {
        const input = new File({contents: Buffer.from('FooBar')});
        await new Checker()._transform(input);
        expect(true).to.not.be.ok;
      }

      catch (err) {
        expect(err).to.be.an.instanceof(Error);
      }
    });

    it('should add a "david" property to the file object', async () => {
      const input = new File({contents: Buffer.from('{"name": "@cedx/gulp-david"}')});
      const file = await new Checker()._transform(input);
      expect(file).to.have.property('david').that.is.an('object');
    });
  });
});
