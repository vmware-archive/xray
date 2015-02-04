var CellsApi = require('./cells_api');
var DesiredLrpsApi = require('./desired_lrps_api');
var Promise = require('../../lib/promise');

var ReceptorApi = {
  fetch() {
    return Promise.all([CellsApi.fetch(), DesiredLrpsApi.fetch()]).then(function([{cells}, {desiredLrps}]) {
      return {cells, desiredLrps};
    });
  }
};

module.exports = ReceptorApi;