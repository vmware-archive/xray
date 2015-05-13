beforeEach(function() {
  jasmine.addMatchers({
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
              var observed = typeof request[k] === 'function' ? request[k]() : request[k];
              return jasmine.matchersUtil.equals(observed, options[k]);
            });
          });
          /* eslint-disable comma-spacing*/
          var message = pass ?
            `Expected ${actual} not to have been requested with ${JSON.stringify(options)}` :
            `Expected ${actual} to have been requested with ${JSON.stringify(options)},
            actual requests were ${jasmine.Ajax.requests.filter(/.*/).map(function(req) {
              return `${JSON.stringify({
                method: req.method,
                url: req.url,
                data: req.data && req.data(),
                headers: req.requestHeaders
              })}`;
            }).join('\n')}`;
          /* eslint-enable comma-spacing*/
          return {pass, message};
        }
      };
    }
  });
});