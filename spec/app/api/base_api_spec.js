require('../spec_helper');

describe('BaseApi', function() {
  var Request, subject;
  beforeEach(function() {
    Request = require('superagent').Request;
    spyOn(Request.prototype, 'auth').and.callThrough();
    subject = require('../../../app/api/base_api');
    subject.baseUrl = 'http://www.example.com';
  });

  describe('#fetch', function() {
    describe('without username or password', function() {
      it('sends a get response to the correct url', function() {
        subject.fetch('foo');
        expect(`${subject.baseUrl}/v1/foo`).toHaveBeenRequestedWith({method: 'GET'});
      });
    });

    describe('when credentials are provided', function() {
      var user = 'user', password = 'password';
      beforeEach(function() {
        subject.baseUrl = `http://${user}:${password}@www.example.com`;
        subject.fetch('foo');
      });

      it('sends a get response to the correct url without the credentials in the url', function() {
        expect('www.example.com/v1/foo').toHaveBeenRequestedWith({method: 'GET'});
      });

      it('makes a request with credentials', function() {
        expect(Request.prototype.auth).toHaveBeenCalledWith(user, password);
      });
    });

    describe('with method specified', function() {
      it('sends a response to the correct url with the specified method', function() {
        subject.fetch('foo', {method: 'post'});
        expect(`${subject.baseUrl}/v1/foo`).toHaveBeenRequestedWith({method: 'POST'});
      });
    });
  });
});