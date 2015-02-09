require('../spec_helper');

describe('ArrayHelper', function() {
  var subject;
  beforeEach(function() {
    subject = require('../../../app/helpers/array_helper');
  });

  describe('#diff', function() {
    it('returns empty arrays when nothing changes', function() {
      expect(subject.diff([{id: 'one'}, {id: 'two'}], [{id: 'one'}, {id: 'two'}], 'id')).toEqual(jasmine.objectContaining({added: [], removed: []}));
    });

    it('returns added elements', function() {
      expect(subject.diff([{id: 'one'}], [{id: 'one'}, {id: 'two'}], 'id')).toEqual(jasmine.objectContaining({added: [{id: 'two'}], removed: []}));
    });

    it('returns removed elements', function() {
      expect(subject.diff([{id: 'one'}, {id: 'two'}], [{id: 'one'}], 'id')).toEqual(jasmine.objectContaining({added: [], removed: [{id: 'two'}]}));
    });

    it('returns changed elements', function() {
      expect(subject.diff([{id: 'one'}, {id: 'two', since: 1}], [{id: 'one'}, {id: 'two', since: 2}], 'id', (a, b) => a.since !== b.since)).toEqual({added: [], removed: [], changed: [{id: 'two', since: 2}]})
    });
  });
});