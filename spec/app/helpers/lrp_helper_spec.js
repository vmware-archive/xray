require('../spec_helper');

describe('LrpHelper', function() {
  var subject;
  beforeEach(function() {
    subject = require('../../../app/helpers/lrp_helper');
  });

  describe('#findLrp', function() {
    it('returns the lrp with the same epoch but largest index', function() {
      var foundDesiredLrp = Factory.build('desiredLrp', {modification_tag: {epoch: 12345, index: 1}});
      var desiredLrps = [
        Factory.build('desiredLrp'),
        Factory.build('desiredLrp', {modification_tag: {epoch: 12345, index: 0}}),
        foundDesiredLrp
      ];
      var desiredLrp = Factory.build('desiredLrp', {modification_tag: {epoch: 12345, index: 0}});
      expect(subject.findLrp(desiredLrps, desiredLrp)).toEqual(foundDesiredLrp);
    });

    it('returns null if there is no matching epoch', function() {
      expect(subject.findLrp([], Factory.build('desiredLrp'))).toBe(null);
    });
  });

  describe('#getRoutes', function() {
    var cfRoutes;
    beforeEach(function() {
      cfRoutes = [Factory.build('route', {'hostnames': ['foo.com', 'bar.com']}), Factory.build('route', {'hostnames': ['p.dubs']})];
    });

    it('returns the routes of the first router', function() {
      var routes = {
        'cf-router': cfRoutes,
        'df-router': Factory.buildList('route', 3)
      };
      var desiredLrp = Factory.build('desiredLrp', {routes});
      expect(subject.getRoutes(desiredLrp)).toEqual(cfRoutes);
    });

    it('returns empty array if there are no routes', function(){
      expect(subject.getRoutes(Factory.build('desiredLrp', {routes: {}}))).toEqual([]);
      expect(subject.getRoutes(Factory.build('desiredLrp', {routes: undefined}))).toEqual([]);
    });
  });

  describe('#getHostname', function() {
    var cfRoutes;
    beforeEach(function() {
      cfRoutes = [Factory.build('route', {'hostnames': ['foo.com', 'bar.com']}), Factory.build('route', {'hostnames': ['p.dubs']})];
    });

    it('returns the first hostname', function() {
      var routes = {
        'cf-router': cfRoutes,
        'df-router': Factory.buildList('route', 3)
      };
      var desiredLrp = Factory.build('desiredLrp', {routes});
      expect(subject.getHostname(desiredLrp)).toEqual('foo.com');
    });

    it('return null if there is no hostname', function() {
      expect(subject.getHostname(Factory.build('desiredLrp', {routes: {}}))).toBeNull();
    });
  });

  describe('#actualLrpIndex', function() {
    it('returns in expected string', function() {
      expect(subject.actualLrpIndex(Factory.build('actualLrp', {process_guid: 'foo', index: 1}))).toEqual('foo00001');
    });
  });
});