require('../spec_helper');

describe('DesiredLrpHelper', function() {
  var subject;
  beforeEach(function() {
    subject = require('../../../app/helpers/desired_lrp_helper');
  });

  describe('#findDesirdLrp', function() {
    it('returns the desired lrp with the same epoch but largest index', function() {
      var foundDesiredLrp = Factory.build('desiredLrp', {modification_tag: {epoch: 12345, index: 1}});
      var desiredLrps = [
        Factory.build('desiredLrp'),
        Factory.build('desiredLrp', {modification_tag: {epoch: 12345, index: 0}}),
        foundDesiredLrp
      ];
      var desiredLrp = Factory.build('desiredLrp', {modification_tag: {epoch: 12345, index: 0}});
      expect(subject.findDesiredLrp(desiredLrps, desiredLrp)).toEqual(foundDesiredLrp);
    });

    it('returns null if there is no matching epoch', function() {
      expect(subject.findDesiredLrp([], Factory.build('desiredLrp'))).toBe(null);
    });
  });
});