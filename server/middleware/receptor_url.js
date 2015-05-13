module.exports = function(req, res, next) {
  var receptorUrl = req.query && req.query.receptor ||
                    req.body && req.body.receptor_url ||
                    req.cookies && req.cookies.receptor_url ||
                    process.env.RECEPTOR_URL;
  req.receptorUrl = receptorUrl;
  if (receptorUrl) {
    res.cookie('receptor_url', receptorUrl);
  }
  next();
};