var join = require('url-join');
var {compact} = require('../../helpers/application_helper');

function assetPath(asset, config = {}) {
  var {assetHost, assetPort} = config;
  if (assetHost) {
    return `//${join(...[compact([assetHost, assetPort]).join(':'), asset])}`;
  }
  var revManifest;
  try {
    revManifest = require('../../public/rev-manifest.json');
  } catch(e) {
    revManifest = {};
  }
  return `/${revManifest[asset] || asset}`;
}

module.exports = {assetPath};