var basicAuth = require('node-basicauth');
var bodyParser = require('body-parser');
var express = require('express');
var {show} = require('./middleware/component');
var Application = require('../app/components/application');
var Setup = require('../app/components/setup');
var receptorAuthorization = require('./middleware/receptor_authorization');

var app = express();

const XRAY_USER = process.env.XRAY_USER;
const XRAY_PASSWORD = process.env.XRAY_PASSWORD;
if (XRAY_USER && XRAY_PASSWORD) {
  app.use(basicAuth({[XRAY_USER]: XRAY_PASSWORD}));
}

app.use(bodyParser.json());
app.use(express.static(__dirname + '/../public'));

app.get('/', receptorAuthorization, show(Application, 'application'));
app.get('/setup', receptorAuthorization, show(Setup, 'setup'));

app.post('/receptor_url', receptorAuthorization, function(req, res) {
  var {receptor_url: receptorUrl} = req.body;
  if (!receptorUrl) {
    res
      .status(422)
      .type('json')
      .clearCookie('receptor_authorization')
      .send({error: 'receptor_url is required'});
    return;
  }

  res.status(200).type('json').send({ok: true});
});

if(process.env.NODE_ENV === 'development') {
  var fakeApi = require('./middleware/fake_api');
  app.get('/api/v1/cells', fakeApi.v1.cells.index);
  app.get('/api/v1/actual_lrps', fakeApi.v1.actualLrps.index);
  app.get('/api/v1/desired_lrps', fakeApi.v1.desiredLrps.index);
}
module.exports = app;