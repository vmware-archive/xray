require('../spec_helper');

describe('Cursor', function() {
  var Cursor, subject, data, cells, callbackSpy;
  beforeEach(function() {
    Cursor = require('../../../app/lib/cursor');
    cells = Factory.buildList('cell', 3);
    data = {scaling: 'containers', cells, actualLrps: Factory.buildList('actualLrp', 2, {cell_id: cells[0].cell_id}), desiredLrps: []};
    callbackSpy = jasmine.createSpy('callback');
    subject = new Cursor(data, callbackSpy);
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

    it('can find objects in arrays', function() {
      expect(subject.refine('cells', cells[1]).get()).toBe(cells[1]);
    });

    it('works if the path is a single object', function() {
      expect(subject.refine('cells').refine(cells[1]).get()).toBe(cells[1]);
    });

    it('returns a cursor than updates in the expected way', function() {
      var cell = Factory.build('cell');
      subject.refine('cells').refine(cells[1]).set(cell);
      expect(callbackSpy).toHaveBeenCalled();
      expect(callbackSpy.calls.mostRecent().args[0].cells).toContain(cell);
    });

  });

  describe('#update', function() {
    it('calls the callback with the changed data', function() {
      subject.update({scaling: {$set: 'memory'}});
      expect(callbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({scaling: 'memory', cells}));
    });

    it('calls the callback when cursor is refined', function() {
      subject.refine('scaling').update({$set: 'memory'});
      expect(callbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({scaling: 'memory', cells}));
    });

    it('calls the callback when the cursor is refined at multiple levels', function() {
      subject.refine('cells', 0, 'cell_id').update({$set: 'something'});
      expect(callbackSpy).toHaveBeenCalled();
      expect(callbackSpy.calls.mostRecent().args[0].cells[0].cell_id).toEqual('something');
    });
  });

  describe('#merge', function() {
    it('updates the cursor', function() {
      subject.merge({foo: 'bar'});
      expect(callbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({foo: 'bar', cells}));
    });
  });

  describe('#set', function() {
    it('updates the cursor', function() {
      subject.refine('scaling').set('memory');
      expect(callbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({scaling: 'memory', cells}));
    });
  });

  describe('#splice', function() {
    it('updates the cursor', function() {
      subject.refine('cells').splice([0, 1]);
      expect(callbackSpy.calls.mostRecent().args[0].cells).not.toContain(cells[0]);
    });
  });

  describe('#push', function() {
    it('updates the cursor', function() {
      var cell = Factory.build('cell');
      subject.refine('cells').push(cell);
      expect(callbackSpy).toHaveBeenCalled();
      expect(callbackSpy.calls.mostRecent().args[0].cells).toContain(cell);
    });
  });

  describe('#unshift', function() {
    it('updates the cursor', function() {
      var cell = Factory.build('cell');
      subject.refine('cells').unshift(cell);
      expect(callbackSpy).toHaveBeenCalled();
      expect(callbackSpy.calls.mostRecent().args[0].cells).toContain(cell);
    });
  });

  describe('#apply', function() {
    it('updates the cursor', function() {
      var newCells = Factory.buildList('cell', 3);
      subject.refine('cells').apply(() => newCells);
      expect(callbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({cells: newCells}));
    });
  });

  describe('chaining', function() {
    it('works', function() {
      subject.set({foo: 'bar'}).merge({bar: 'baz'});
      expect(callbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({foo: 'bar'}));
      expect(callbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({bar: 'baz', cells}));
    });
  });

  describe('#isEqual', function() {
    it('returns true when the cursors are the same', function() {
      var anotherCursor = new Cursor(data, jasmine.createSpy('callback'));
      expect(subject.isEqual(anotherCursor)).toBe(true);
      expect(subject.isEqual(anotherCursor.refine('scaling'))).toBe(false);
    });
  });

  describe('#remove', function() {
    it('updates the cursor when given an object', function() {
      subject.refine('cells').remove(cells[0]);
      expect(callbackSpy.calls.mostRecent().args[0].cells).not.toContain(cells[0]);
    });
  });
});