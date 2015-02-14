var Promise = require('../../lib/promise');
var request = require('superagent');
var {getCredentials} = require('../helpers/url_helper');

var BaseApi = {
  baseUrl: null,

  get(url) {
    var {user, password} = getCredentials(this.baseUrl);
    return new Promise(function(resolve, reject) {
      request.get(`${BaseApi.baseUrl}/v1/${url}`)
        .auth(user, password)
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