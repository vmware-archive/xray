require('../spec_helper');

describe('SetupApi', function() {
  var subject;
  beforeEach(function() {
    subject = require('../../../app/api/setup_api');
  });

  describe('#create', function() {
    const RECEPTOR_URL = 'http://example.com';
    var doneSpy;
    beforeEach(function() {
      doneSpy = jasmine.createSpy('done');
      subject.create({receptorUrl: RECEPTOR_URL}).then(doneSpy);
    });

    it('makes an ajax request', function() {
      expect('/setup').toHaveBeenRequestedWith({method: 'POST', data: {receptor_url: RECEPTOR_URL}});
    });
  });
});