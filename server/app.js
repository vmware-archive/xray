var application = require('./middleware/application_middleware');
var basicAuth = require('node-basicauth');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var favicon = require('serve-favicon');
var gzipStatic = require('connect-gzip-static');
var receptorUrl = require('./middleware/receptor_url');
var setup = require('./middleware/setup_middleware');
var app = express();

const XRAY_USER = process.env.XRAY_USER;
const XRAY_PASSWORD = process.env.XRAY_PASSWORD;
if (XRAY_USER && XRAY_PASSWORD) {
  app.use(basicAuth({[XRAY_USER]: XRAY_PASSWORD}));
}

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(favicon(`${__dirname}/../app/images/favicon.ico`));
app.use(gzipStatic(`${__dirname}/../public`, {maxAge: process.env.NODE_ENV === 'production' && 604800000}));

app.get('/', receptorUrl, ...application.show);
app.get('/setup', receptorUrl, ...setup.show);
app.post('/setup', receptorUrl, ...setup.create);

var fakeApi = require('./middleware/fake_api');
app.post('/demo/v1/auth_cookie', (req, res) => res.status(204).end());
app.get('/demo/v1/cells', fakeApi.demo.cells.index);
app.get('/demo/v1/actual_lrps', fakeApi.demo.actualLrps.index);
app.get('/demo/v1/desired_lrps', fakeApi.demo.desiredLrps.index);

if(process.env.NODE_ENV === 'development') {
  app.post('/perf/v1/auth_cookie', (req, res) => res.status(204).end());
  app.get('/perf/v1/cells', fakeApi.perf.cells.index);
  app.get('/perf/v1/actual_lrps', fakeApi.perf.actualLrps.index);
  app.get('/perf/v1/desired_lrps', fakeApi.perf.desiredLrps.index);
}
module.exports = app;