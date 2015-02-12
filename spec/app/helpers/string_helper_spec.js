require('../spec_helper');

describe('StringHelper', function() {
  var subject;
  beforeEach(function() {
    subject = require('../../../app/helpers/string_helper');
  });

  describe('#lpad', function() {
    it('pads the string with the character and count specified', function() {
      expect(subject.lpad(1234, '0', 6)).toEqual('001234');
    });

    it('deals with strings longer than the pad', function() {
      expect(subject.lpad(1234, '0', 3)).toEqual('1234');
    });
  });
});
