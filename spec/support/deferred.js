var Promise = require('../../lib/promise');
var mockPromises = require('mock-promises');

var Deferred = function() {
  var resolver, rejector;
  var promise = new Promise(function(res, rej) {
    resolver = res;
    rejector = rej
  });

  var wrapper = Object.assign(promise, {
    resolve(...args) {
      resolver(...args);
      mockPromises.executeForPromise(promise);
      return wrapper;
    },
    reject(...args) {
      rejector(...args);
      mockPromises.executeForPromise(promise);
      return wrapper;
    },
    promise() {
      return promise;
    }
  });
  return wrapper;
};

module.exports = Deferred;