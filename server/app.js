var Application = require('../app/components/application');
var basicAuth = require('node-basicauth');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var favicon = require('serve-favicon');
var gzipStatic = require('connect-gzip-static');
var Setup = require('../app/components/setup');
var receptorAuthorization = require('./middleware/receptor_authorization');
var {show} = require('./middleware/component');

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

function redirectToSetup(req, res, next) {
  var receptorUrl = req.query && req.query.receptor ||
                    req.cookies && req.cookies.receptor_url ||
                    process.env.RECEPTOR_URL;

  if (receptorUrl) return next();
  res.redirect(303, '/setup');
}

app.get('/', receptorAuthorization, redirectToSetup, show(Application, 'application'));
app.get('/setup', receptorAuthorization, show(Setup, 'setup'));

app.post('/setup', receptorAuthorization, function(req, res) {
  var {receptor_url: receptorUrl} = req.body;
  if (!receptorUrl) {
    res
      .status(422)
      .clearCookie('receptor_authorization')
      .send('');
    return;
  }
  res.redirect(303, `/?receptor=${receptorUrl}`);
});

var fakeApi = require('./middleware/fake_api');
app.get('/demo/v1/cells', fakeApi.demo.cells.index);
app.get('/demo/v1/actual_lrps', fakeApi.demo.actualLrps.index);
app.get('/demo/v1/desired_lrps', fakeApi.demo.desiredLrps.index);

if(process.env.NODE_ENV === 'development') {
  app.get('/perf/v1/cells', fakeApi.perf.cells.index);
  app.get('/perf/v1/actual_lrps', fakeApi.perf.actualLrps.index);
  app.get('/perf/v1/desired_lrps', fakeApi.perf.desiredLrps.index);
}
module.exports = app;