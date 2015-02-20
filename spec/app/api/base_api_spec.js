require('../spec_helper');

describe('BaseApi', function() {
  var Request, subject;
  beforeEach(function() {
    Request = require('superagent').Request;
    spyOn(Request.prototype, 'auth').and.callThrough();
    subject = require('../../../app/api/base_api');
    subject.baseUrl = 'http://www.example.com';
  });


  describe('#get', function() {
    describe('without username or password', function() {
      it('sends a get response to the correct url', function() {
        subject.get('foo');
        var request = jasmine.Ajax.requests.mostRecent();
        expect(request).toBeDefined();
        expect(request.url).toEqual(`${subject.baseUrl}/v1/foo`);
      });
    });


    describe('when credentials are provided', function() {
      var  user = 'user', password = 'password';
      beforeEach(function() {
        subject.baseUrl = `http://${user}:${password}@www.example.com`;
        subject.get('foo');
      });

      it('sends a get response to the correct url', function() {
        var request = jasmine.Ajax.requests.mostRecent();
        expect(request).toBeDefined();
        expect(request.url).toContain('www.example.com/v1/foo');
      });

      it('makes a request with credentials', function() {
        expect(Request.prototype.auth).toHaveBeenCalledWith(user, password);
      });

      it('does not include the credentials in the url (Firefox...)', function() {
        var request = jasmine.Ajax.requests.mostRecent();
        expect(request.url).not.toContain('user:password');
        expect(request.url).toEqual('http://www.example.com/v1/foo');
      });


    });
  });
});