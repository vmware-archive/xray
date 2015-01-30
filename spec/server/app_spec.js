require('./spec_helper');

describe('app', function() {
  var subject, request;
  beforeEach(function() {
    subject =  require('../../server/app');
    request = require('supertest');
  });

  describe('GET /', function() {
    it('renders the layout and application', function(done) {
      var Layout = require('../../server/components/layout');
      var Application = require('../../app/components/application');
      spyOn(Layout.type.prototype, 'render').and.callThrough();
      spyOn(Application.type.prototype, 'render').and.callThrough();
      request(subject)
        .get('/')
        .expect('Content-Type', /html/)
        .end(function(err) {
          expect(err).toBe(null);
          expect(Layout.type.prototype.render).toHaveBeenCalled();
          expect(Application.type.prototype.render).toHaveBeenCalled();
          done();
        });
    });
  });
});