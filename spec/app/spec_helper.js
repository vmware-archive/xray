require('babel/polyfill');
var factories = require.context('../factories', true, /\.js$/);
factories.keys().forEach(factories);
require('jasmine_dom_matchers');

require('../spec_helper');

global.React = require('react/addons');
var jQuery = require('jquery');
global.jQuery = jQuery;
global.$ = jQuery;
global.mockPromises = require('mock-promises');
global.MockEventSource = require('../support/mock_event_source');
global.jasmineReact = require('jasmine-react-helpers');
global.Deferred = require('../support/deferred');

global.xray = global.xray || {};

$.fn.simulate = function(eventName, ...args) {
  if (!this.length) {
    throw new Error(`jQuery Simulate has an empty selection for '${this.selector}'`);
  }
  $.each(this, function() {
    if (['mouseOver', 'mouseOut'].includes(eventName)) {
      React.addons.TestUtils.SimulateNative[eventName](this, ...args);
    } else {
      React.addons.TestUtils.Simulate[eventName](this, ...args);
    }
  });
  return this;
};

require('jasmine-ajax');

beforeEach(function() {
  MockEventSource.install();
  spyOn(React.addons.CSSTransitionGroup.type.prototype, 'render').and.callFake(function() { return (<div>{this.props.children}</div>); });

  var Layout = require('../../server/components/layout');
  spyOn(Layout, 'init');

  mockPromises.install(require('../../lib/promise'));
  jasmine.clock().install();
  jasmine.Ajax.install();
  $('body').find('#root').remove().end().append('<div id="root"/>');
});

afterEach(function() {
  MockEventSource.uninstall();
  require('../../app/api/base_api').baseUrl = null;
  jasmine.Ajax.requests.reset();
  mockPromises.contracts.reset();
});
