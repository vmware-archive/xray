var BaseApi = require('./base_api');

var ActualLrpsApi = {
  fetch() {
    return BaseApi.get('actual_lrps').then(actualLrps => ({actualLrps}));
  }
};

module.exports = ActualLrpsApi;