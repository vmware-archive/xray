require('../spec_helper');
var update = React.addons.update;

describe('DesiredLrp', function() {
  var Cursor, subject, desiredLrp, actualLrps, callbackSpy;
  beforeEach(function() {
    var DesiredLrp = require('../../../app/components/desired_lrp');

    actualLrps = [
      Factory.build('actualLrp', {process_guid: 'Diego'}),
      Factory.build('actualLrp', {process_guid: 'Diego'}),
      Factory.build('actualLrp', {process_guid: 'Diego', state: 'CLAIMED'})
    ];
    desiredLrp = Factory.build('desiredLrp', {process_guid: 'Diego', instances: 3});
    callbackSpy = jasmine.createSpy('callback');
    Cursor = require('../../../app/lib/cursor');
    var $selectedLrp = new Cursor({selectedLrp: null}, callbackSpy).refine('selectedLrp');
    subject = React.render(<DesiredLrp {...{desiredLrp, actualLrps, containerColor: 'blue', $selectedLrp, isSelected: false}}/>, root);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  it('ignores the selected lrp cursor', function() {
    expect(subject.ignoreFastProps).toEqual(['$selectedLrp']);
  });

  describe('routes', function() {
    describe('with no routes', function() {
      it('does not throw an exception', function() {
        desiredLrp = update(desiredLrp, {$merge: {routes: null}});
        subject.setProps({desiredLrp});
        expect(() => subject.setProps({desiredLrp})).not.toThrow();
      });
    });

    describe('with more than one route', function() {
      it('renders the routes with ports', function() {
        desiredLrp.routes['cf-router'].forEach(function({port, hostnames}, i) {
          expect(`.desired-lrp tr:eq(${i}) td:eq(0)`).toContainText(port);
          expect(`.desired-lrp tr:eq(${i}) td:eq(1) a`).toContainText(hostnames[0]);
          expect(`.desired-lrp tr:eq(${i}) td:eq(1) a`).toHaveAttr('href', `//${hostnames[0]}`);
          expect(`.desired-lrp tr:eq(${i}) td:eq(1) a`).toHaveAttr('target', '_blank');
        });
      });
    });

    describe('with one route', function() {
      var route;
      beforeEach(function() {
        route = Factory.build('route');
        desiredLrp = update(desiredLrp, {'routes': {'cf-router': {$set: [route]} }});
        subject.setProps({desiredLrp});
      });

      it('renders the route without the port', function() {
        expect('.desired-lrp').toContainText(route.hostnames[0]);
        expect('.desired-lrp').not.toContainText(route.port);
      });
    });

    describe('with a route with multiple host names', function() {
      var route;
      beforeEach(function() {
        route = Factory.build('route', {hostnames: ['foo.com', 'bar.com']});
        desiredLrp = update(desiredLrp, {'routes': {'cf-router': {$set: [route]} }});
        subject.setProps({desiredLrp});
      });

      it('renders all of the host names', function() {
        expect('.desired-lrp').toContainText('foo.com');
        expect('.desired-lrp').toContainText('bar.com');
      });
    });
  });
  
  describe('when everything is running smoothly', function() {
    beforeEach(function() {
      actualLrps = React.addons.update(actualLrps, {2: {$merge: {state: 'RUNNING'}}});
      subject.setProps({actualLrps});
    });

    it('does not show any errors', function() {
      expect($('.desired-lrp .type-error-3')).not.toExist();
    });
  });

  describe('when not all of the actualLrps are running', function() {
    it('marks the lrp with an error', function() {
      expect($('.desired-lrp .type-error-3')).toExist();
    });
  });

  describe('when mouse over event is triggered on the desired lrp', function() {
    beforeEach(function() {
      $('.desired-lrp').simulate('mouseOver');
    });

    it('sets the selectedLrp on the receptor', function() {
      expect(callbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({selectedLrp: desiredLrp}));
    });
  });

  describe('when the desiredLrp is selected', function() {
    beforeEach(function() {
      subject.setProps({isSelected: true});
    });

    it('highlights the container', function() {
      expect('.container-sidebar').toHaveClass('selected');
    });
  });
});