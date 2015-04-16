var revManifest;
function assetPath(asset) {
  try {
    revManifest = require('../../public/rev-manifest.json');
  } catch(e) {
    revManifest = {};
  }
  return revManifest[asset] || asset;
}

module.exports = {assetPath};