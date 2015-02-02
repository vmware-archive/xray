global.Factory = require('rosie').Factory;

beforeEach(function() {
  jasmine.addMatchers({
    toBeEmpty() {
      return {
        compare(actual) {
          var pass = actual instanceof Array ? !actual.length : !Object.keys(actual).length;
          return { pass };
        }
      }
    }
  });
});