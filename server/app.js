var basicAuth = require('node-basicauth');
var express = require('express');
var Application = require('../app/components/application');
var React = require('react');
var Layout = require('./components/layout');

var app = express();

const XRAY_USER = process.env.XRAY_USER;
const XRAY_PASSWORD = process.env.XRAY_PASSWORD;
if (XRAY_USER && XRAY_PASSWORD) {
  app.use(basicAuth({[XRAY_USER]: XRAY_PASSWORD}));
}

app.use(express.static(__dirname + '/../public'));
app.use(express.static(__dirname + '/../vendor/pui-v1.4.0'));

app.get('/', function(req, res) {
  var receptorUrl = req.query.receptor || process.env.RECEPTOR_URL;
  var scripts = ['application.js'];
  var stylesheets = ['reset.css', 'pivotal-ui.min.css', 'application.css'];
  var config = {receptorUrl};
  var props = {entry: Application, scripts, stylesheets, config};
  var html = React.renderToStaticMarkup(<Layout {...props}/>);
  res.status(200).type('html').send(`<!DOCTYPE html>${html}`);
});

module.exports = app;