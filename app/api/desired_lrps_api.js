var ReceptorApi = require('./receptor_api');

var DesiredLrpsApi = {
  fetch() {
    return ReceptorApi.get('desired_lrps').then(desiredLrps => ({desiredLrps}));
  }
};

module.exports = DesiredLrpsApi;