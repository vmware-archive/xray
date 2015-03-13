var MockPromises = require('mock-promises');

var Deferred = function() {
  var resolver, rejector;
  var promise = new Promise(function(res, rej) {
    resolver = res;
    rejector = rej;
  });

  var wrapper = Object.assign(promise, {
    resolve(...args) {
      resolver(...args);
      MockPromises.executeForPromise(promise);
      return wrapper;
    },
    reject(...args) {
      rejector(...args);
      MockPromises.executeForPromise(promise);
      return wrapper;
    },
    promise() {
      return promise;
    }
  });
  return wrapper;
};

module.exports = Deferred;