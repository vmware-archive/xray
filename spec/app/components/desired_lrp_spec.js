require('../spec_helper');
var update = React.addons.update;

describe('DesiredLrp', function() {
  var subject, desiredLrp, actualLrps;
  beforeEach(function() {
    var DesiredLrp = require('../../../app/components/desired_lrp');

    actualLrps = [
      Factory.build('actualLrp', {process_guid: 'Diego'}),
      Factory.build('actualLrp', {process_guid: 'Diego'}),
      Factory.build('actualLrp', {process_guid: 'Diego', state: 'CLAIMED'})
    ];
    desiredLrp = Factory.build('desiredLrp', {process_guid: 'Diego', instances: 3});
    subject = React.render(<DesiredLrp {...{desiredLrp, actualLrps, containerColor: 'blue'}}/>, root);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  describe('routes', function() {
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
      expect($('.desired-lrp')).not.toHaveClass('bg-error-1');
    });
  });

  describe('when not all of the actualLrps are running', function() {
    it('marks the lrp with an error', function() {
      expect($('.desired-lrp')).toHaveClass('bg-error-1');
    });
  });
});