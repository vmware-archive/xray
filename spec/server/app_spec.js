require('./spec_helper');

describe('app', function() {
  var subject, request;
  beforeEach(function() {
    subject = require('../../server/app');
    request = require('./support/supertest_promisified');
  });

  describe('GET /', function() {
    describe('when a receptor url is not provided as a query param', function() {
      it('redirects to /setup', async function(done) {
        var res = await request(subject).get('/');
        expect(res.status).toEqual(303);
        expect(res.headers.location).toEqual('/setup');
        done();
      });
    });

    describe('when the receptor url is provided as a query param', function() {
      const RECEPTOR_URL = 'http://user:password@example.com';

      var Application, res;
      beforeEach(async function(done) {
        Application = require('../../app/components/application');
        spyOn(Application.type.prototype, 'render').and.callThrough();
        res = await request(subject)
          .get(`/?receptor=${RECEPTOR_URL}`)
          .expect('Content-Type', /html/);
        expect(res.status).toEqual(200);
        done();
      });

      it('sets the receptor url in the cookie', function() {
        expect(res.headers['set-cookie'][0]).toContain(`receptor_url=${encodeURIComponent(RECEPTOR_URL)}`);
      });

      it('renders the receptor authorization in the cookie', function() {
        expect(res.headers['set-cookie'][1]).toContain('receptor_authorization=dXNlcjpwYXNzd29yZA%3D%3D');
      });

      it('renders the application with the receptor url in the config', function() {
        expect(Application.type.prototype.render).toHaveBeenCalled();
        var application = Application.type.prototype.render.calls.mostRecent().object;
        expect(application.props.config).toEqual(jasmine.objectContaining({receptorUrl: RECEPTOR_URL}));
      });
    });

    describe('when the receptor url is provided as a cookie', function() {
      const RECEPTOR_URL = 'http://user:password@example.com';
      var Application, res;
      beforeEach(async function(done) {
        Application = require('../../app/components/application');
        spyOn(Application.type.prototype, 'render').and.callThrough();
        res = await request(subject)
          .get(`/`)
          .set('cookie', `receptor_url=${RECEPTOR_URL}`)
          .expect('Content-Type', /html/);
        expect(res.status).toEqual(200);
        done();
      });

      it('sets the receptor url in the cookie', function() {
        expect(res.headers['set-cookie'][0]).toContain(`receptor_url=${encodeURIComponent(RECEPTOR_URL)}`);
      });

      it('renders the receptor authorization in the cookie', function() {
        expect(res.headers['set-cookie'][1]).toContain('receptor_authorization=dXNlcjpwYXNzd29yZA%3D%3D');
      });

      it('renders the application with the receptor url in the config', function() {
        expect(Application.type.prototype.render).toHaveBeenCalled();
        var application = Application.type.prototype.render.calls.mostRecent().object;
        expect(application.props.config).toEqual(jasmine.objectContaining({receptorUrl: RECEPTOR_URL}));
      });
    });
  });

  describe('GET /setup', function() {
    var Layout, Setup;
    beforeEach(function() {
      Layout = require('../../server/components/layout');
      Setup = require('../../app/components/setup');
      spyOn(Layout.type.prototype, 'render').and.callThrough();
      spyOn(Setup.type.prototype, 'render').and.callThrough();
    });

    it('renders the layout and setup', async function(done) {
      var res = await request(subject)
        .get('/setup')
        .expect('Content-Type', /html/);
      expect(res.status).toEqual(200);
      expect(Layout.type.prototype.render).toHaveBeenCalled();
      expect(Setup.type.prototype.render).toHaveBeenCalled();
      done();
    });
  });

  describe('POST /setup', function() {
    describe('when a receptor url is provided', function() {
      describe('when there are credentials', function() {
        const RECEPTOR_URL = 'http://user:password@example.com';
        var res;
        beforeEach(async function(done) {
          res = await request(subject)
            .post('/setup')
            .type('form')
            .send({receptor_url: RECEPTOR_URL});
          expect(res.status).toEqual(303);
          done();
        });

        it('sets the receptor url in the cookie', function() {
          expect(res.headers['set-cookie'][0]).toContain(`receptor_url=${encodeURIComponent(RECEPTOR_URL)}`);
        });

        it('sets the receptor authorization in the cookie', function() {
          expect(res.headers['set-cookie'][1]).toContain('receptor_authorization=dXNlcjpwYXNzd29yZA%3D%3D');
        });
      });

      describe('when there are no credentials', function() {
        const RECEPTOR_URL = 'http://example.com';
        it('does not returns the cookie', async function(done) {
          var res = await request(subject)
            .post('/setup')
            .type('form')
            .send({receptor_url: RECEPTOR_URL});
          expect(res.status).toEqual(303);
          expect(res.headers['set-cookie'][1]).not.toContain('receptor_authorization');
          done();
        });
      });
    });

    describe('when no receptor url is provided', function() {
      it('is not successful', async function(done) {
        var res = await request(subject)
          .post('/setup')
          .type('form')
          .send({});
        expect(res.status).toEqual(422);
        done();
      });
    });
  });
});