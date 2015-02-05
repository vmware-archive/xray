require('../spec_helper');
describe('ApplicationHelper', function() {
  var subject;
  beforeEach(function() {
    subject = require('../../../app/helpers/application_helper');
  });

  describe('#pickColor', function() {
    it('picks the same color for a given string', function() {
      var colors = ['red', 'green', 'blue'];
      expect(subject.pickColor(colors, 1)).toEqual('green');
      expect(subject.pickColor(colors, 'hello world')).toEqual('blue');
      expect(subject.pickColor(colors, 'hello world')).toEqual('blue');
      expect(subject.pickColor(colors, 'another')).toEqual('red');
      expect(subject.pickColor(colors, 'another')).toEqual('red');
    });
  });
});