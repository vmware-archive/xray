var Promise = require('../../lib/promise');
var request = require('superagent');

var ReceptorApi = {
  baseUrl: null,

  get(url) {
    return new Promise(function(resolve, reject) {
      request.get(`${ReceptorApi.baseUrl}/v1/${url}`)
        .accept('json')
        .end(function(err, res) {
          if (err) return reject(err);
          resolve(res.body);
        }
      );
    });
  }
};

module.exports = ReceptorApi;