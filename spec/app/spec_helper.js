require('6to5/polyfill');
var factories = require.context('../factories', true, /\.js$/);
factories.keys().forEach(factories);
require('jasmine_dom_matchers');

require('../spec_helper');

global.React = require('react/addons');
var jQuery = require('jquery');
global.jQuery = jQuery;
global.$ = jQuery;
global.mockPromises = require('../support/vendor/mock-promises');
global.jasmineReact = require('jasmine-react-helpers');
global.Deferred = require('../support/deferred');

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
