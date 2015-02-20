var UrlHelper = {
  /* jshint unused:false */
  getCredentials(url) {
    var [_, prefix, user, password, suffix] = url.match(/(^.+?\/\/)(.+?):(.+?)@(.+$)/) || [];
    if(prefix && suffix) {
      url = prefix + suffix;
    }
    return {user, password, url};
  }
  /* jshint unused:true */
};

module.exports = UrlHelper;