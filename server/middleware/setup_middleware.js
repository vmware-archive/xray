var Setup = require('../../app/components/setup');
var {show} = require('./component');

function create(req, res) {
  var {receptor_url: receptorUrl} = req.body;
  if (!receptorUrl) {
    res.status(422).clearCookie('receptor_url').end();
    return;
  }
  res.redirect(303, '/');
}

module.exports = {
  show: show(Setup, 'setup'),
  create: [create]
};