require('../spec_helper');

describe('DesiredLrpsApi', function() {
  const RECEPTOR_URL = 'http://example.com';
  var subject;
  beforeEach(function() {
    require('../../../app/api/base_api').baseUrl = RECEPTOR_URL;
    subject = require('../../../app/api/desired_lrps_api');
  });

  describe('#fetch', function() {
    var doneSpy, lrpsRequest, lrpsPromise;
    beforeEach(function() {
      doneSpy = jasmine.createSpy('done');
      lrpsPromise = subject.fetch();
      lrpsPromise.then(doneSpy);
      lrpsRequest = jasmine.Ajax.requests.filter(`${RECEPTOR_URL}/v1/desired_lrps`)[0];
    });

    it('makes an ajax request for desired_lrps', function() {
      expect(lrpsRequest).toBeDefined();
    });

    describe('when the request succeeds', function() {
      var desiredLrps;
      beforeEach(function() {
        desiredLrps = Factory.buildList('desiredLrp', 3);
        lrpsRequest.respondWith({
          status: 200,
          responseText: JSON.stringify(desiredLrps)
        });
        mockPromises.executeForResolvedPromises();
        mockPromises.executeForPromise(lrpsPromise);
      });

      it('resolves the promise with the desiredLrps', function() {
        expect(doneSpy).toHaveBeenCalledWith({desiredLrps});
      });
    });
  });
});