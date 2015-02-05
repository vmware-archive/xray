require('../spec_helper');

describe('ArrayHelper', function() {
  var subject;
  beforeEach(function() {
    subject = require('../../../app/helpers/array_helper');
  });

  describe('#sortBy', function() {
    it('sorts an array by the specified key', function() {
      const collection = [{name: 'banana', color:'yellow'}, {name: 'pear', color:'green'}, {name: 'apple', color:'red'}];
      expect(subject.sortBy(collection, 'name').map(a => a.name)).toEqual(['apple', 'banana', 'pear']);
      expect(subject.sortBy(collection, ['name']).map(a => a.name)).toEqual(['apple', 'banana', 'pear']);
    });

    it('sorts by additional keys', function() {
      const collection = [{name: 'banana', color:'yellow'}, {name: 'apple', color:'red'}, {name: 'apple', color:'green'}];
      expect(subject.sortBy(collection, ['name', 'color'])).toEqual([ {name:'apple', color:'green'}, {name:'apple', color:'red'}, {name:'banana', color:'yellow'} ]);
    });

    it('does not sort in place', function() {
      const collection = [{name: 'banana', color:'yellow'}, {name: 'pear', color:'green'}, {name: 'apple', color:'red'}];
      subject.sortBy(collection, 'name');
      expect(collection.map(a => a.name)).toEqual(['banana', 'pear', 'apple']);
    });

    describe('when ascending false is passed', function() {
      it('sorts in descending order', function() {
        const collection = [{name: 'banana', color:'yellow'}, {name: 'pear', color:'green'}, {name: 'apple', color:'red'}];
        expect(subject.sortBy(collection, 'name', {ascending: false}).map(a => a.name)).toEqual(['pear', 'banana', 'apple']);
      });
    });
  });
});