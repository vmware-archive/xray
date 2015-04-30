var UrlHelper = {
  getCredentials(url) {
    /*eslint-disable no-unused-vars*/
    var [_, prefix, user, password, suffix] = url.match(/(^.+?\/\/)(.+?):(.+?)@(.+$)/) || [];
    /*eslint-enable no-unused-vars*/
    if(prefix && suffix) {
      url = prefix + suffix;
    }
    return {user: user && decodeURIComponent(user), password: password && decodeURIComponent(password), url: url.replace(/\/+$/, '')};
  }
};

module.exports = UrlHelper;