var BaseApi = require('./base_api');

var DesiredLrpsApi = {
  fetch() {
    return BaseApi.get('desired_lrps').then(desiredLrps => ({desiredLrps}));
  }
};

module.exports = DesiredLrpsApi;