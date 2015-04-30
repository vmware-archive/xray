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
global.MockEventSource = require('pui-event-source/mock-event-source');
global.jasmineReact = require('jasmine-react-helpers');
global.Deferred = require('../support/deferred');

global.OldPromise = global.Promise;
global.Promise = require('es6-promise').Promise;

$.fn.simulate = function(eventName, ...args) {
  if (!this.length) {
    throw new Error(`jQuery Simulate has an empty selection for '${this.selector}'`);
  }
  $.each(this, function() {
    if (['click', 'mouseOver', 'mouseOut'].includes(eventName)) {
      React.addons.TestUtils.SimulateNative[eventName](this, ...args);
    } else {
      React.addons.TestUtils.Simulate[eventName](this, ...args);
    }
  });
  return this;
};

require('jasmine-ajax');

beforeEach(function() {
  var mockLocation = jasmine.createSpyObj('location', ['assign', 'reload', 'replace']);
  global.xray = {location: mockLocation};

  spyOn(require('../../app/vendor/google_analytics'), 'init');
  spyOn(React.addons.CSSTransitionGroup.type.prototype, 'render').and.callFake(function() { return (<div>{this.props.children}</div>); });

  var Layout = require('../../server/components/layout');
  spyOn(Layout, 'init');

  jasmine.Ajax.install();
  jasmine.clock().install();
  MockPromises.install(Promise);
  MockEventSource.install();
  $('body').find('#root').remove().end().append('<main id="root"/>');
});

afterEach(function() {
  require('../../app/api/base_api').baseUrl = null;
  jasmine.Ajax.requests.reset();
  jasmine.clock().uninstall();
  MockPromises.contracts.reset();
  MockEventSource.uninstall();
});
