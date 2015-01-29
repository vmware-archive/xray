var express = require('express');
var Application = require('../app/components/application');
var React = require('react');
var Layout = require('./components/layout');


var app = express();

app.use(express.static(__dirname + '/../public'));

app.get('/', function(req, res) {
  var scripts = ['application.js'];
  res.status(200).type('html').send(`<!DOCTYPE html>${React.renderToStaticMarkup(<Layout entry={Application} scripts={scripts}/>)}`);
});

module.exports = app;