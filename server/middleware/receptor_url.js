function receptorUrlFromFormData(body) {
  if(!body) return null;

  var {username, password, receptor_url: receptorUrl} = body;
  if(!receptorUrl) return null;
  /* eslint-disable no-unused-vars */
  var [_, protocol, address] = receptorUrl.match(/(^.+?\/\/)(.+$)/) || [];
  /* eslint-enable no-unused-vars */
  var credentials = username && password ? `${username}:${password}@` : '';
  return `${protocol}${credentials}${address}`;
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