require('../spec_helper');

describe('Cursor', function() {
  var Cursor, subject, data, cells;
  beforeEach(function() {
    Cursor = require('../../../app/lib/cursor');
    cells = Factory.buildList('cell', 3);
    data = {scaling: 'containers', cells, actualLrps: Factory.buildList('actualLrp', 2, {cell_id: cells[0].cell_id}), desiredLrps: []};
    subject = new Cursor(data);
  });

  describe('#get', function() {
    it('returns the data at the specified key', function() {
      expect(subject.get('scaling')).toEqual('containers');
      expect(subject.get('cells', 0)).toEqual(cells[0]);
      expect(subject.get('cells', 0, 'cell_id')).toEqual(cells[0].cell_id);
      expect(subject.get()).toEqual(data);
    });
  });

  describe('#refine', function() {
    it('returns a new cursor that points to the given path', function() {
      var cursor = subject.refine('scaling');
      expect(cursor).toEqual(jasmine.any(Cursor));
      expect(cursor.get()).toEqual('containers');
    });
  });
});