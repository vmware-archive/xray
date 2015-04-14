global.Factory = require('rosie').Factory;

beforeEach(function() {
  jasmine.addMatchers({
    toBeEmpty() {
      return {
        compare(actual) {
          var pass = actual instanceof Array ? !actual.length : !Object.keys(actual).length;
          return {pass};
        }
      };
    },

    toHaveBeenRequested() {
      return {
        compare(actual) {
          var pass = jasmine.Ajax.requests.filter(new RegExp(actual)).length > 0;
          return {pass};
        }
      };
    },

    toHaveBeenRequestedWith() {
      return {
        compare(actual, options) {
          var requests = jasmine.Ajax.requests.filter(new RegExp(actual));
          var pass = requests.some(request => {
            return Object.keys(options).every(k => {
              return JSON.stringify(typeof request[k] === 'function' ? request[k]() : request[k]) === JSON.stringify(options[k]);
            });
          });
          var message = pass ?
            `Expected ${actual} not to have been requested with ${JSON.stringify(options)}` :
            `Expected ${actual} to have been requested with ${JSON.stringify(options)}`;
          return {pass, message};
        }
      };
    }
  });
});