var React = require('react');
var Layout = require('../components/layout');
const colors = require('../../config/colors.json');

function show(entry, entryName) {
  function renderComponent(req, res) {
    var scripts = ['common.js', `${entryName}.js`];
    var stylesheets = ['pui.css', 'application.css'];
    var config = {receptorUrl: req.receptorUrl, colors};
    var props = {entry, config, scripts, stylesheets};
    var html = React.renderToStaticMarkup(<Layout {...props}/>);

    res.status(200).type('html').send(`<!DOCTYPE html>${html}`);
  }

  return [renderComponent];
}

module.exports = {show};