require('../support/spec_helper');

global.React = require('react');
global.$ = require('jquery');
global.mockPromises = require('../support/vendor/mock-promises');

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
