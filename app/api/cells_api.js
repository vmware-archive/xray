var Promise = require('../../lib/promise');
var request = require('superagent');

function get(url) {
  return new Promise(function(resolve, reject) {
    request.get(`${CellsApi.baseUrl}/v1/${url}`)
      .accept('json')
      .end(function(err, res) {
        if (err) return reject(err);
        resolve(res.body);
      }
    );
  });
}

var CellsApi = {
  baseUrl: null,

  fetch() {
    return Promise.all([get('cells'), get('actual_lrps')]).then(function([cells, actualLrps]) {
      return {
        cells: cells.map(cell => Object.assign(cell,
          {actual_lrps: actualLrps.filter(lrp => lrp.cell_id === cell.cell_id)})
        )
      };
    });
  }
};


module.exports = CellsApi;