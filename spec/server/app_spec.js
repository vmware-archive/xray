require('./spec_helper');

describe('app', function() {
  var subject, request;
  beforeEach(function() {
    subject = require('../../server/app');
    request = require('./support/supertest_promisified');
  });

  describe('GET /', function() {
    it('renders the layout and application', async function(done) {
      var Layout = require('../../server/components/layout');
      var Application = require('../../app/components/application');
      spyOn(Layout.type.prototype, 'render').and.callThrough();
      spyOn(Application.type.prototype, 'render').and.callThrough();
      var res = await request(subject)
        .get('/')
        .expect('Content-Type', /html/);
      expect(res.status).toEqual(200);
      expect(Layout.type.prototype.render).toHaveBeenCalled();
      expect(Application.type.prototype.render).toHaveBeenCalled();
      expect(res.headers['set-cookie']).toBeUndefined();
      done();
    });

    describe('when a receptor url is provided as a query param', function() {
      const RECEPTOR_URL = 'http://user:password@example.com';
      it('renders the application the receptor url in from the query param', async function(done) {
        var Application = require('../../app/components/application');
        spyOn(Application.type.prototype, 'render').and.callThrough();

        var res = await request(subject)
          .get(`/?receptor=${RECEPTOR_URL}`)
          .expect('Content-Type', /html/);
        expect(res.status).toEqual(200);
        expect(Application.type.prototype.render).toHaveBeenCalled();
        var application = Application.type.prototype.render.calls.mostRecent().object;
        expect(application.props.config).toEqual(jasmine.objectContaining({receptorUrl: RECEPTOR_URL}));
        expect(res.headers['set-cookie']).toEqual(['receptor_authorization=dXNlcjpwYXNzd29yZA%3D%3D; Path=/']);
        done();
      });
    });
  });

  describe('GET /setup', function() {
    it('renders the layout and setup', async function(done) {
      var Layout = require('../../server/components/layout');
      var Setup = require('../../app/components/setup');
      spyOn(Layout.type.prototype, 'render').and.callThrough();
      spyOn(Setup.type.prototype, 'render').and.callThrough();
      var res = await request(subject)
        .get('/setup')
        .expect('Content-Type', /html/);
      expect(res.status).toEqual(200);
      expect(Layout.type.prototype.render).toHaveBeenCalled();
      expect(Setup.type.prototype.render).toHaveBeenCalled();
      expect(res.headers['set-cookie']).toBeUndefined();
      done();
    });
  });

  describe('POST /receptor_url', function() {
    describe('when a receptor url is provided', function() {
      describe('when there are credentials', function() {
        const RECEPTOR_URL = 'http://user:password@example.com';
        it('returns the cookie with the receptor authorization', async function(done) {
          var res = await request(subject)
            .post('/receptor_url')
            .send({receptor_url: RECEPTOR_URL});
          expect(res.status).toEqual(200);
          expect(res.headers['set-cookie']).toEqual(['receptor_authorization=dXNlcjpwYXNzd29yZA%3D%3D; Path=/']);
          done();
        });
      });

      describe('when there are no credentials', function() {
        const RECEPTOR_URL = 'http://example.com';
        it('does not returns the cookie', async function(done) {
          var res = await request(subject)
            .post('/receptor_url')
            .send({receptor_url: RECEPTOR_URL});
          expect(res.status).toEqual(200);
          expect(res.headers['set-cookie']).toBeUndefined();
          done();
        });
      });
    });

    describe('when no receptor url is provided', function() {
      it('is not successful', async function(done) {
        try {
          var res = await request(subject)
            .post('/receptor_url');
        } catch(err) {
          expect(res.status).toEqual(422);
          expect(err).toBeDefined();
        }
        done();
      });
    });
  });
});