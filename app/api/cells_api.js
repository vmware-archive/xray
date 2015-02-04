var BaseApi = require('./base_api');
var Promise = require('../../lib/promise');

var CellsApi = {
  fetch() {
    return Promise.all([BaseApi.get('cells'), BaseApi.get('actual_lrps')]).then(function([cells, actualLrps]) {
      return {
        cells: cells.map(cell => Object.assign(cell,
          {actual_lrps: actualLrps.filter(lrp => lrp.cell_id === cell.cell_id)})
        )
      };
    });
  }
};

module.exports = CellsApi;