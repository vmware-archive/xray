var Url = require('url');
var UrlHelper = {
  getCredentials(url) {
    var parsedUrl = Url.parse(url);
    var [user, password] = parsedUrl.auth ? parsedUrl.auth.split(':').map(decodeURIComponent) : [];
    return {user, password, url: Url.format(Object.assign(parsedUrl, {auth: null}))};
  }
};

module.exports = UrlHelper;