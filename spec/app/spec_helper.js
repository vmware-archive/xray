require('babel/polyfill');
var factories = require.context('../factories', true, /\.js$/);
factories.keys().forEach(factories);
require('jasmine_dom_matchers');

require('../spec_helper');

global.React = require('react/addons');
var jQuery = require('jquery');
global.jQuery = jQuery;
global.$ = jQuery;
global.MockPromises = require('mock-promises');
global.MockEventSource = require('../support/mock_event_source');
global.jasmineReact = require('jasmine-react-helpers');
global.Deferred = require('../support/deferred');

global.xray = global.xray || {};
global.OldPromise = global.Promise;
global.Promise = require('es6-promise').Promise;

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
  spyOn(React.addons.CSSTransitionGroup.type.prototype, 'render').and.callFake(function() { return (<div>{this.props.children}</div>); });

  var Layout = require('../../server/components/layout');
  spyOn(Layout, 'init');

  jasmine.Ajax.install();
  jasmine.clock().install();
  MockPromises.install(Promise);
  MockEventSource.install();
  $('body').find('#root').remove().end().append('<div id="root"/>');
});

afterEach(function() {
  require('../../app/api/base_api').baseUrl = null;
  jasmine.Ajax.requests.reset();
  MockPromises.contracts.reset();
  MockEventSource.uninstall();
});
