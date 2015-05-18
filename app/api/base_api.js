var request = require('superagent');
var {getCredentials} = require('../helpers/url_helper');
var join = require('url-join');

var baseApiUrl = null;

var BaseApi = {
  get baseUrl() { return baseApiUrl; },

  set baseUrl(u) { baseApiUrl = u; },

  fetch(route, options = {}) {
    var {method = 'get'} = options;
    var {user, password, url} = getCredentials(this.baseUrl);
    return new Promise(function(resolve, reject) {
      request[method](join(url, 'v1', route))
        .auth(user, password)
        .withCredentials()
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