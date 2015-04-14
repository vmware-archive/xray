var {getCredentials} = require('../../app/helpers/url_helper');

function getReceptorCredentials(receptorUrl) {
  if (!receptorUrl) return null;
  var {user, password} = getCredentials(receptorUrl);
  if (!user || !password) return null;
  return new Buffer(`${user}:${password}`).toString('base64');
}


module.exports = function(req, res, next) {
  var receptorUrl = req.query && req.query.receptor || req.body && req.body.receptor_url || process.env.RECEPTOR_URL;
  req.receptorUrl = receptorUrl;
  if (receptorUrl) {
    var receptorAuthorization = getReceptorCredentials(receptorUrl);
    if (receptorAuthorization) res.cookie('receptor_authorization', receptorAuthorization);
  }
  next();
};