require('../spec_helper');
describe('ReactHelper', function() {
  var subject;
  beforeEach(function() {
    subject = require('../../../app/helpers/react_helper');
  });

  describe('#mergeClassnames', function() {
    it('returns a string with all the classes', function() {
      expect(subject.mergeClassnames('foo bar baz', 'bar', 'apple pear', 'banana')).toEqual('foo bar baz apple pear banana');
    });
  });
});