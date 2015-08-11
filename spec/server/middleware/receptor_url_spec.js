require('../spec_helper');

describe('receptorUrl Middleware', function() {
  var subject, cookieSpy;

  beforeEach(function() {
    subject = require('../../../server/middleware/receptor_url');
    cookieSpy = jasmine.createSpy('cookie');
  });

  describe('when the request has query params', function() {
    beforeEach(function() {
      var req = {query: {receptor: 'http://username:password@example.com'}};
      var res = {cookie: cookieSpy };
      subject(req, res, () => {});
    });

    it('sets the receptor_url on the cookie', function() {
      expect(cookieSpy).toHaveBeenCalledWith('receptor_url', 'http://username:password@example.com');
    });
  });

  describe('when the request has a body with credentials', function() {
    beforeEach(function() {
      var req = {body: {
        user: 'username',
        password: 'password',
        receptor_url: 'http://example.com'
      }};
      var res = {cookie: cookieSpy };
      subject(req, res, () => {});
    });

    it('sets the receptor_url on the cookie', function() {
      expect(cookieSpy).toHaveBeenCalledWith('receptor_url', 'http://username:password@example.com/');
    });
  });


  describe('when the request has a body without credentials', function() {
    beforeEach(function() {
      var req = {body: {
        receptor_url: 'http://example.com'
      }};
      var res = {cookie: cookieSpy };
      subject(req, res, () => {});
    });

    it('sets the receptor_url on the cookie', function() {
      expect(cookieSpy).toHaveBeenCalledWith('receptor_url', 'http://example.com/');
    });
  });

  describe('when the request has a cookie', function() {
    beforeEach(function() {
      var req = {cookies: {receptor_url: 'http://username:password@example.com'}};
      var res = {cookie: cookieSpy };
      subject(req, res, () => {});
    });

    it('sets the receptor_url on the cookie', function() {
      expect(cookieSpy).toHaveBeenCalledWith('receptor_url', 'http://username:password@example.com');
    });
  });

  describe('when the request has a query param and a cookie', function() {
    beforeEach(function() {
      var req = {
        query: {receptor: 'http://username:password@example.com'},
        cookies: {receptor_url: 'http://person:token@illustration.net'}
      };
      var res = {cookie: cookieSpy };
      subject(req, res, () => {});
    });

    it('defaults to the query params', function() {
      expect(cookieSpy).toHaveBeenCalledWith('receptor_url', 'http://username:password@example.com');
    });
  });

  describe('when the request has a body and a cookie', function() {
    beforeEach(function() {
      var req = {
        body: {
          user: 'username',
          password: 'my%20password',
          receptor_url: 'http://example.com'
        },
        cookies: {receptor_url: 'http://person:token@illustration.net'}
      };
      var res = {cookie: cookieSpy };
      subject(req, res, () => {});
    });

    it('defaults to the body', function() {
      expect(cookieSpy).toHaveBeenCalledWith('receptor_url', 'http://username:my%20password@example.com/');
    });
  });
});