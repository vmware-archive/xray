require('../spec_helper');

describe('AuthorizationApi', function() {
  const RECEPTOR_URL = 'http://example.com';
  var subject;
  beforeEach(function() {
    require('../../../app/api/base_api').baseUrl = RECEPTOR_URL;
    subject = require('../../../app/api/authorization_api');
  });

  describe('#create', function() {
    var doneSpy, failSpy;
    beforeEach(function() {
      doneSpy = jasmine.createSpy('done');
      failSpy = jasmine.createSpy('fail');
      subject.create().then(doneSpy, failSpy);
    });

    it('makes an ajax request', function() {
      expect(`${RECEPTOR_URL}/v1/auth_cookie`).toHaveBeenRequestedWith({method: 'POST'});
    });

    describe('when the ajax request is successful', function() {
      beforeEach(function() {
        jasmine.Ajax.requests.mostRecent().respondWith({status: 204});
        MockPromises.executeForResolvedPromises();
        MockPromises.executeForResolvedPromises();
      });

      it('resolves the promise', function() {
        expect(doneSpy).toHaveBeenCalled();
      });
    });

    describe('when the ajax requeste is not successful', function() {
      beforeEach(function() {
        jasmine.Ajax.requests.mostRecent().respondWith({status: 401});
        MockPromises.executeForResolvedPromises();
        MockPromises.executeForResolvedPromises();
      });

      it('rejects the promise', function() {
        expect(doneSpy).not.toHaveBeenCalled();
        expect(failSpy).toHaveBeenCalled();
      });
    });
  });
});