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
        desiredLrps = [
          Factory.build('desiredLrp', {process_guid: 'B'}),
          Factory.build('desiredLrp', {process_guid: 'C'}),
          Factory.build('desiredLrp', {process_guid: 'A'})
        ];
        lrpsRequest.respondWith({
          status: 200,
          responseText: JSON.stringify(desiredLrps)
        });
        MockPromises.executeForResolvedPromises();
        MockPromises.executeForPromise(lrpsPromise);
      });

      it('resolves the promise with the desiredLrps sorted by process guid', function() {
        expect(doneSpy.calls.mostRecent().args[0].desiredLrps.map(({process_guid}) => process_guid)).toEqual(['A', 'B', 'C']);
      });
    });
  });
});