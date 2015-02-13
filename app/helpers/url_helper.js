var UrlHelper = {
  /* jshint unused:false */
  getCredentials(url) {
    var [_, user, password] = url.match(/^.+?\/\/(.+?):(.+?)@.+$/) || [];
    return {user, password};
  }
  /* jshint unused:true */
};

module.exports = UrlHelper;