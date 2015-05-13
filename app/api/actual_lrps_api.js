var BaseApi = require('./base_api');

var ActualLrpsApi = {
  fetch() {
    return BaseApi.fetch('actual_lrps').then(actualLrps => ({actualLrps}));
  }
};

module.exports = ActualLrpsApi;