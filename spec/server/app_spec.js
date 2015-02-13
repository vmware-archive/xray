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
        .end(function(err, res) {
          expect(err).toBe(null);
          expect(Layout.type.prototype.render).toHaveBeenCalled();
          expect(Application.type.prototype.render).toHaveBeenCalled();
          expect(res.headers['set-cookie']).toBeUndefined();
          done();
        });
    });

    describe('when a receptor url is provided as a query param', function() {
      const RECEPTOR_URL = 'http://user:password@example.com';
      it('renders the application the receptor url in from the query param', function(done) {
        var Application = require('../../app/components/application');
        spyOn(Application.type.prototype, 'render').and.callThrough();

        request(subject)
          .get(`/?receptor=${RECEPTOR_URL}`)
          .expect('Content-Type', /html/)
          .end(function(err, res) {
            expect(err).toBe(null);
            expect(Application.type.prototype.render).toHaveBeenCalled();
            var application = Application.type.prototype.render.calls.mostRecent().object;
            expect(application.props.config).toEqual(jasmine.objectContaining({receptorUrl: RECEPTOR_URL}));
            expect(res.headers['set-cookie']).toEqual(['receptor_authorization=ZGllZ286aG9yc2UydGhicnVzaA%3D%3D; Path=/']);
            done();
          });
      });
    });
  });
});