var Promise = require('../../lib/promise');
var request = require('superagent');

var CellsApi = {
  baseUrl: null,

  fetch() {
    return new Promise(function(resolve, reject) {
      request.get(`${CellsApi.baseUrl}/v1/cells`)
        .accept('json')
        .end(function(err, res) {
          if (err) return reject(err);

          resolve({cells: res.body});
        });
    });
  }
};


module.exports = CellsApi;