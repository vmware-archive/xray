require('../spec_helper');

describe('ArrayHelper', function() {
  var subject;
  beforeEach(function() {
    subject = require('../../../app/helpers/array_helper');
  });

  describe('#sortBy', function() {
    const collection = [{index: 'banana'}, {index: 'pear'}, {index: 'apple'}];
    it('sorts an array by the specified key', function() {
      expect(subject.sortBy(collection, 'index').map(a => a.index)).toEqual(['apple', 'banana', 'pear']);
    });

    it('does not sort in place', function() {
      subject.sortBy(collection, 'index');
      expect(collection.map(a => a.index)).toEqual(['banana', 'pear', 'apple']);
    });

    describe('when ascending false is passed', function() {
      it('sorts in descending order', function() {
        expect(subject.sortBy(collection, 'index', {ascending: false}).map(a => a.index)).toEqual(['pear', 'banana', 'apple']);
      });
    });
  });
});