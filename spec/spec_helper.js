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
    },

    toHaveBeenRequested() {
      return {
        compare(actual) {
          var pass = jasmine.Ajax.requests.filter(new RegExp(actual)).length > 0;
          return { pass };
        }
      }
    }
  });
});