var BaseApi = require('./base_api');

var DesiredLrpsApi = {
  fetch() {
    return BaseApi.get('desired_lrps').then(function(desiredLrps) {
      return {desiredLrps: desiredLrps.sort((a, b) => a.process_guid < b.process_guid ? -1 : 1)};
    });
  },

  scale(desiredLrp, instances) {
    return BaseApi.put(`desired_lrps/${desiredLrp.process_guid}`, {instances});
  }
};

module.exports = DesiredLrpsApi;