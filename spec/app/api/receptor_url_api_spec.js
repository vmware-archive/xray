require('../spec_helper');

describe('ReceptorUrlApi', function() {
  var subject;
  beforeEach(function() {
    subject = require('../../../app/api/receptor_url_api');
  });

  describe('#create', function() {
    const RECEPTOR_URL = 'http://example.com';
    var doneSpy, request;
    beforeEach(function() {
      doneSpy = jasmine.createSpy('done');
      subject.create({receptorUrl: RECEPTOR_URL}).then(doneSpy);
      request = jasmine.Ajax.requests.mostRecent();
    });

    it('makes an ajax request', function() {
      expect(request).toBeDefined();
      expect(request.url).toEqual('/receptor_url');
      expect(JSON.parse(request.params)).toEqual({receptor_url: RECEPTOR_URL});
    });
  });
});