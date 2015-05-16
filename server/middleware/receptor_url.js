var Url = require('url');

function receptorUrlFromFormData(body) {
  if(!body) return null;

  var {user, password, receptor_url: receptorUrl} = body;
  if(!receptorUrl) return null;
  var parsedUrl = Url.parse(receptorUrl);
  var auth = user && password ? [user, password].map(decodeURIComponent).join(':') : null;
  return Url.format(Object.assign(parsedUrl, {auth}));
}

module.exports = function(req, res, next) {
  var receptorUrl = req.query && req.query.receptor ||
                    receptorUrlFromFormData(req.body) ||
                    req.cookies && req.cookies.receptor_url ||
                    process.env.RECEPTOR_URL;

  req.receptorUrl = receptorUrl;
  if (receptorUrl) {
    res.cookie('receptor_url', receptorUrl);
  }
  next();
};