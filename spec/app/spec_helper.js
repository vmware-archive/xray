require('../support/spec_helper');

global.React = require('react/addons');
global.$ = require('jquery');
global.mockPromises = require('../support/vendor/mock-promises');
global.jasmineReact = require('jasmine-react-helpers');

$.fn.simulate = function(eventName, ...args) {
  $.each(this, function() {
    React.addons.TestUtils.Simulate[eventName](this, ...args);
  });
  return this;
};

require('jasmine-ajax');

beforeEach(function() {
  var Layout = require('../../server/components/layout');
  spyOn(Layout, 'init');

  mockPromises.install(require('../../lib/promise'));
  jasmine.clock().install();
  jasmine.Ajax.install();
  $('body').find('#root').remove().end().append('<div id="root"/>');
});

afterEach(function() {
  jasmine.Ajax.requests.reset();
  mockPromises.contracts.reset();
});
