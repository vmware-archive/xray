require('../spec_helper');

describe('AssetHelper', function() {
  var subject;

  beforeEach(function() {
    subject = require('../../../server/helpers/asset_helper');
  });

  describe('#assetPath', function() {
    describe('when there is a config with an asset host and asset port', function() {
      const filename = 'file.png';
      const assetHost = 'localhost';
      const assetPort = '3001';
      it('returns the asset on the server', function() {
        expect(subject.assetPath(filename, {assetHost, assetPort})).toEqual(`//${assetHost}:${assetPort}/${filename}`);
        expect(subject.assetPath(filename, {assetHost})).toEqual(`//${assetHost}/${filename}`);
      });
    });
  });
});