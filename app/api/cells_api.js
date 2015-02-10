var BaseApi = require('./base_api');

var CellsApi = {
  fetch() {
    return BaseApi.get('cells').then(cells => ({cells}));
  }
};

module.exports = CellsApi;