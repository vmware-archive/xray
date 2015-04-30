require('../spec_helper');

describe('UrlHelper', function() {
  var subject;
  beforeEach(function() {
    subject = require('../../../app/helpers/url_helper');
  });

  describe('#getCredentials', function() {
    it('returns the username and password when it is passed as basic auth', function() {
      expect(subject.getCredentials('http://name:pass@example.com')).toEqual({user: 'name', password: 'pass', url: 'http://example.com'});
    });

    it('returns undefined for user and password when it is not passed as basic auth', function() {
      expect(subject.getCredentials('http://example.com')).toEqual({user: undefined, password: undefined, url: 'http://example.com'});
    });

    it('decodes username and password', function() {
      expect(subject.getCredentials('http://my%20name:some%20password@example.com')).toEqual({user: 'my name', password: 'some password', url: 'http://example.com'});
    });
  });
});