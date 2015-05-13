var BaseApi = require('./base_api');

var AuthorizationApi = {
  create() {
    return BaseApi.fetch('auth_cookie', {method: 'post'});
  }
};

module.exports = AuthorizationApi;