require('../spec_helper');

describe('ActualLrpsApi', function() {
  const RECEPTOR_URL = 'http://example.com';
  var subject;
  beforeEach(function() {
    require('../../../app/api/base_api').baseUrl = RECEPTOR_URL;
    subject = require('../../../app/api/actual_lrps_api');
  });

  describe('#fetch', function() {
    var doneSpy, lrpsRequest;
    beforeEach(function() {
      doneSpy = jasmine.createSpy('done');
      subject.fetch().then(doneSpy);
      lrpsRequest = jasmine.Ajax.requests.filter(`${RECEPTOR_URL}/v1/actual_lrps`)[0];
    });

    it('makes an ajax request for actual_lrps', function() {
      expect(lrpsRequest).toBeDefined();
    });

    describe('when the ajax request is successful', function() {
      var actualLrps;
      beforeEach(function() {
        actualLrps = Factory.buildList('actualLrp', 3);
        lrpsRequest.respondWith({
          stats: 200,
          responseText: JSON.stringify(actualLrps)
        });
        mockPromises.executeForResolvedPromises();
        mockPromises.executeForResolvedPromises();
      });

      it('resolves the promise with the cells and actualLrps', function() {
        expect(doneSpy).toHaveBeenCalledWith({actualLrps});
      });
    });
  });
});