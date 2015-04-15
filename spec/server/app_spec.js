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
        expect(res.status).toEqual(302);
        expect(res.headers.location).toEqual('/setup');
        done();
      });
    });

    describe('when the receptor url is provided as a query param', function() {
      const RECEPTOR_URL = 'http://user:password@example.com';

      describe('when the ToS are not accepted', function() {
        var res;
        beforeEach(async function(done) {
          res = await request(subject).get(`/?receptor=${RECEPTOR_URL}`);
          done();
        });

        it('renders the application the receptor url in from the query param', function() {
          expect(res.status).toEqual(302);
          expect(res.headers.location).toEqual('/setup');
        });
      });

      describe('when the ToS are accepted', function() {
        var Application, res;
        beforeEach(async function(done) {
          Application = require('../../app/components/application');
          spyOn(Application.type.prototype, 'render').and.callThrough();
          res = await request(subject)
            .get(`/?receptor=${RECEPTOR_URL}`)
            .set('cookie', 'accept_tos=true')
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
    describe('when the receptor url is provided as a cookie and ToS are accepted', function() {
      const RECEPTOR_URL = 'http://user:password@example.com';
      var Application, res;
      beforeEach(async function(done) {
        Application = require('../../app/components/application');
        spyOn(Application.type.prototype, 'render').and.callThrough();
        res = await request(subject)
          .get(`/`)
          .set('cookie', `accept_tos=true;receptor_url=${RECEPTOR_URL}`)
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

    describe('when the terms of service have not been accepted', function() {
      it('renders the layout and setup', async function(done) {
        var res = await request(subject)
          .get('/setup')
          .expect('Content-Type', /html/);
        expect(res.status).toEqual(200);
        expect(Layout.type.prototype.render).toHaveBeenCalled();
        expect(Setup.type.prototype.render).toHaveBeenCalled();
        var config = Layout.type.prototype.render.calls.mostRecent().object.props.config;
        expect(config.acceptTos).toBe(false);
        done();
      });
    });

    describe('when the terms of service have been accepted', function() {
      it('renders the layout and setup with the ToS', async function(done) {
        var res = await request(subject)
          .get('/setup')
          .set('cookie', 'accept_tos=true')
          .expect('Content-Type', /html/);
        expect(res.status).toEqual(200);
        expect(Layout.type.prototype.render).toHaveBeenCalled();
        var config = Layout.type.prototype.render.calls.mostRecent().object.props.config;
        expect(config.acceptTos).toBe(true);
        done();
      });
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
            .send({receptor_url: RECEPTOR_URL});
          expect(res.status).toEqual(200);
          done();
        });

        it('sets the receptor url in the cookie', function() {
          expect(res.headers['set-cookie'][0]).toContain(`receptor_url=${encodeURIComponent(RECEPTOR_URL)}`);
        });

        it('sets the receptor authorization in the cookie', function() {
          expect(res.headers['set-cookie'][1]).toContain('receptor_authorization=dXNlcjpwYXNzd29yZA%3D%3D');
        });

        it('sets the accept tos in the cookie', function() {
          expect(res.headers['set-cookie'][2]).toContain('accept_tos=true');
        });
      });

      describe('when there are no credentials', function() {
        const RECEPTOR_URL = 'http://example.com';
        it('does not returns the cookie', async function(done) {
          var res = await request(subject)
            .post('/setup')
            .send({receptor_url: RECEPTOR_URL});
          expect(res.status).toEqual(200);
          expect(res.headers['set-cookie'][1]).not.toContain('receptor_authorization');
          done();
        });
      });
    });

    describe('when no receptor url is provided', function() {
      it('is not successful', async function(done) {
        try {
          var res = await request(subject)
            .post('/setup');
        } catch(err) {
          expect(res.status).toEqual(422);
          expect(err).toBeDefined();
        }
        done();
      });
    });
  });
});