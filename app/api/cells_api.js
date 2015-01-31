var Promise = require('../../lib/promise');
var request = require('superagent');

var CellsApi = {
  baseUrl: null,

  fetch() {
    var cellsPromise = new Promise(function(resolve, reject) {
      request.get(`${CellsApi.baseUrl}/v1/cells`)
        .accept('json')
        .end(function(err, res) {
          if (err) return reject(err);
          resolve(res.body);
        });
    });

    var actualLrpsPromise = new Promise(function(resolve, reject) {
      request.get(`${CellsApi.baseUrl}/v1/actual_lrps`)
        .accept('json')
        .end(function(err, res) {
          if (err) return reject(err);
          resolve(res.body);
        });
    });

    return Promise.all([cellsPromise, actualLrpsPromise]).then(function([cells, actualLrps]) {
      return {
        cells: cells.map(cell => Object.assign(cell,
          {actual_lrps: actualLrps.filter(lrp => lrp.cell_id === cell.cell_id)})
        )
      };
    });
  }
};


module.exports = CellsApi;