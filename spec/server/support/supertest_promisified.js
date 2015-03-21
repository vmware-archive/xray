var methods = require('methods');
var supertest = require('supertest');

function then(onFulfilled, onRejected) {
  return new Promise(function(resolve, reject) {
    this.end(function(error, response) {
      if (error) return reject(error);
      resolve(response);
    });
  }.bind(this)).then(onFulfilled, onRejected);
}

module.exports = function(...args) {
  var request = supertest(...args);
  return methods.reduce(function(wrapped, method) {
    return Object.assign(wrapped, {
      [method]() {
        return Object.assign(request[method].apply(request, arguments), {then});
      }
    });
  }, {});
};