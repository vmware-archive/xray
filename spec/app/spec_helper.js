require('babel/polyfill');
var factories = require.context('../factories', true, /\.js$/);
factories.keys().forEach(factories);
require('jasmine_dom_matchers');

require('../spec_helper');
var React = require('react/addons');
var jQuery = require('jquery');
var {withContext} = require('./support/react_helper');
var MockPromises = require('mock-promises');
var MockEventSource = require('pui-event-source/mock-event-source');
var Deferred = require('../support/deferred');
var OldPromise = global.Promise;
var Promise = require('es6-promise').Promise;

Object.assign(global, {
  React,
  jQuery,
  $: jQuery,
  withContext,
  MockPromises,
  MockEventSource,
  Deferred,
  OldPromise,
  Promise
});

require('jasmine-ajax');
require('./support/matchers');

beforeEach(function() {
  var Cursor = require('pui-cursor');
  Cursor.async = false;
  
  var mockLocation = jasmine.createSpyObj('location', ['assign', 'reload', 'replace']);
  global.xray = {location: mockLocation};

  spyOn(require('../../app/vendor/google_analytics'), 'init');
  spyOn(React.addons.CSSTransitionGroup.prototype, 'render').and.callFake(function() { return (<div>{this.props.children}</div>); });
  spyOn(require('../../app/components/svg').prototype, 'render').and.returnValue(null);

  var Layout = require('../../server/components/layout');
  spyOn(Layout, 'init');

  jasmine.Ajax.install();
  jasmine.clock().install();
  MockPromises.install(Promise);
  MockEventSource.install();
  $('.tooltip').parent().remove();
  $('body').find('#root').remove().end().append('<main id="root"/>');
});

afterEach(function() {
  require('../../app/api/base_api').baseUrl = null;
  jasmine.Ajax.uninstall();
  jasmine.clock().uninstall();
  MockPromises.contracts.reset();
  MockEventSource.uninstall();
  require('pui-react-portals').reset();
});
