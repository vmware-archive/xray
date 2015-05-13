var React = require('react');
var Layout = require('../components/layout');
var {assetPath} = require('../helpers/asset_helper');
const colors = require('../../config/colors.json');

function redirectToRoot(req, res, next) {
  if (req.receptorUrl && req.query && req.query.receptor) {
    res.redirect(303, '/');
    return;
  }
  next();
}

function show(entry, entryName) {
  function renderComponent(req, res) {
    var scripts = [`react-${React.version}.js`, 'common.js', `${entryName}.js`].map(assetPath);
    var stylesheets = ['components.css', 'application.css'].map(assetPath);
    var config = {receptorUrl: req.receptorUrl, colors};
    var props = {entry, config, scripts, stylesheets};
    var html = React.renderToStaticMarkup(<Layout {...props}/>);

    res.status(200).type('html').send(`<!DOCTYPE html>${html}`);
  }

  return [redirectToRoot, renderComponent];
}

module.exports = {show};