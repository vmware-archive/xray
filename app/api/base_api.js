var request = require('superagent');
var {getCredentials} = require('../helpers/url_helper');

var BaseApi = {
  baseUrl: null,

  get(route) {
    var {user, password, url} = getCredentials(this.baseUrl);
    return new Promise(function(resolve, reject) {
      request.get(`${url}/v1/${route}`)
        .auth(user, password)
        .withCredentials()
        .accept('json')
        .end(function(err, res) {
          if (err) return reject(err);
          resolve(res.body);
        }
      );
    });
  },

  put(route, data = {}) {
    var {user, password, url} = getCredentials(this.baseUrl);
    return new Promise(function(resolve, reject) {
      request.put(`${url}/v1/${route}`)
        .auth(user, password)
        .withCredentials()
        .accept('json')
        .send(data)
        .end(function(err, res) {
          if (err) return reject(err);
          resolve(res.body);
        }
      );
    });
  }
};

module.exports = BaseApi;