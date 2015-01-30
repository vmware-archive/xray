var express = require('express');
var Application = require('../app/components/application');
var React = require('react');
var Layout = require('./components/layout');


var app = express();

app.use(express.static(__dirname + '/../public'));

app.get('/', function(req, res) {
  var scripts = ['application.js'];
  var html = React.renderToStaticMarkup(<Layout entry={Application} scripts={scripts} config={{receptorUrl: process.env.RECEPTOR_URL}}/>);
  res.status(200).type('html').send(`<!DOCTYPE html>${html}`);
});

module.exports = app;