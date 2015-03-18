var basicAuth = require('node-basicauth');
var bodyParser = require('body-parser');
var express = require('express');
var fs = require('fs');
var Application = require('../app/components/application');
var React = require('react');
var Layout = require('./components/layout');
var app = express();
var {getCredentials} = require('../app/helpers/url_helper');

const XRAY_USER = process.env.XRAY_USER;
const XRAY_PASSWORD = process.env.XRAY_PASSWORD;
if (XRAY_USER && XRAY_PASSWORD) {
  app.use(basicAuth({[XRAY_USER]: XRAY_PASSWORD}));
}

app.use(bodyParser.json());
app.use(express.static(__dirname + '/../public'));
app.use(express.static(__dirname + '/../vendor/pui-v1.4.0'));

function getReceptorCredentials(receptorUrl) {
  if (!receptorUrl) return null;
  var {user, password} = getCredentials(receptorUrl);
  if (!user || !password) return null;
  return new Buffer(`${user}:${password}`).toString('base64');
}

app.get('/', function(req, res) {
  var receptorUrl = req.query.receptor || process.env.RECEPTOR_URL;
  var scripts = ['application.js'];
  var stylesheets = ['pivotal-ui.min.css', 'application.css'];
  var colors = JSON.parse(fs.readFileSync('config/colors.json'));
  var config = {receptorUrl, colors};
  var props = {entry: Application, scripts, stylesheets, config, className: 'bg-neutral-1'};
  var html = React.renderToStaticMarkup(<Layout {...props}/>);

  var receptorAuthorization = getReceptorCredentials(receptorUrl);
  var result = res.status(200).type('html');
  if (receptorAuthorization) result.cookie('receptor_authorization', receptorAuthorization);
  result.send(`<!DOCTYPE html>${html}`);
});

app.post('/receptor_url', function(req, res) {
  var {receptor_url: receptorUrl} = req.body;
  if (!receptorUrl) {
    res
      .status(422)
      .type('json')
      .clearCookie('receptor_authorization')
      .send({error: 'receptor_url is required'});
    return;
  }

  var receptorAuthorization = getReceptorCredentials(receptorUrl);
  var result = res.status(200).type('json');
  if (receptorAuthorization) result.cookie('receptor_authorization', receptorAuthorization);
  result.send({ok: true});
});

if(process.env.NODE_ENV === 'development') {
  var fakeApi = require('./middleware/fake_api');
  app.get('/api/v1/cells', fakeApi.v1.cells.index);
  app.get('/api/v1/actual_lrps', fakeApi.v1.actualLrps.index);
  app.get('/api/v1/desired_lrps', fakeApi.v1.desiredLrps.index);
}
module.exports = app;