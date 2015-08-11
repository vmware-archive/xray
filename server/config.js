try {
  var localConfig = process.env.NODE_ENV !== 'production' ? require('../config/local.json') : {};
} catch(e) {
  localConfig = {};
}

var config = Object.assign({}, require('../config/application.json'), require(`../config/${process.env.NODE_ENV}.json`), localConfig);
module.exports = config;