var Promise = require('../../lib/promise');
var request = require('superagent');

var BaseApi = {
  baseUrl: null,

  get(url) {
    return new Promise(function(resolve, reject) {
      request.get(`${BaseApi.baseUrl}/v1/${url}`)
        .accept('json')
        .end(function(err, res) {
          if (err) return reject(err);
          resolve(res.body);
        }
      );
    });
  }
};

module.exports = BaseApi;