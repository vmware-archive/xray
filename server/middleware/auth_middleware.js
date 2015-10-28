var auth = require('basic-auth');

function authenticate(req, res, next) {
  const XRAY_USER = process.env.XRAY_USER;
  const XRAY_PASSWORD = process.env.XRAY_PASSWORD;

  if (XRAY_USER && XRAY_PASSWORD) {
    var credentials = auth(req);
    if (!credentials || credentials.name !== XRAY_USER || credentials.pass !== XRAY_PASSWORD) {
      res.status(401);
      res.set('WWW-Authenticate', 'Basic realm="X-Ray"');
      res.send('Authentication required')
    } else {
      next()
    }
  } else {
    next();
  }
}

module.exports = {authenticate};