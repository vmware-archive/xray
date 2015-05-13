var BaseApi = require('./base_api');

var CellsApi = {
  fetch() {
    return BaseApi.fetch('cells').then(cells => ({cells}));
  }
};

module.exports = CellsApi;