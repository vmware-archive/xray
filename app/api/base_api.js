var Promise = require('../../lib/promise');
var request = require('superagent');

var BaseApi = {
  baseUrl: null,

  /* jshint unused:false */
  get(url) {
    var [_, user, password] = this.baseUrl.match(/^.+?\/\/(.+?):(.+?)@.+$/) || [];
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
  /* jshint unused:true */
};

module.exports = BaseApi;