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
});