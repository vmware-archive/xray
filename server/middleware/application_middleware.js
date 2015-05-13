var Application = require('../../app/components/application');
var {show} = require('./component');

function redirectToSetup(req, res, next) {
  var receptorUrl = req.query && req.query.receptor ||
    req.cookies && req.cookies.receptor_url ||
    process.env.RECEPTOR_URL;

  if (receptorUrl) return next();
  res.redirect(303, '/setup');
}

module.exports = {
  show: [redirectToSetup, ...show(Application, 'application')]
};