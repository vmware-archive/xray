var application = require('./middleware/application_middleware');
var bodyParser = require('body-parser');
const {authenticate} = require('./middleware/auth_middleware');
var cookieParser = require('cookie-parser');
var express = require('express');
var favicon = require('serve-favicon');
var gzipStatic = require('connect-gzip-static');
var receptorUrl = require('./middleware/receptor_url');
var setup = require('./middleware/setup_middleware');
var app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(favicon(`${__dirname}/../app/images/favicon.ico`));
app.use(gzipStatic(`${__dirname}/../public`, {maxAge: process.env.NODE_ENV === 'production' && 604800000}));

app.get('/', authenticate, receptorUrl, ...application.show);
app.get('/setup', authenticate, receptorUrl, ...setup.show);
app.post('/setup', authenticate, receptorUrl, ...setup.create);

var fakeApi = require('./middleware/fake_api');
app.post('/demo/v1/auth_cookie', ...fakeApi.demo.authCookie.show);
app.get('/demo/v1/cells', ...fakeApi.demo.cells.index);
app.get('/demo/v1/actual_lrps', ...fakeApi.demo.actualLrps.index);
app.get('/demo/v1/desired_lrps', ...fakeApi.demo.desiredLrps.index);

if(process.env.NODE_ENV === 'development') {
  app.post('/perf/v1/auth_cookie', ...fakeApi.perf.authCookie.show);
  app.get('/perf/v1/cells', ...fakeApi.perf.cells.index);
  app.get('/perf/v1/actual_lrps', ...fakeApi.perf.actualLrps.index);
  app.get('/perf/v1/desired_lrps', ...fakeApi.perf.desiredLrps.index);
}
module.exports = app;