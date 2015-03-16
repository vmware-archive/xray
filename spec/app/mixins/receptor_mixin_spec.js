require('../spec_helper');

describe('ReceptorMixin', function() {
  var subject, callbackSpy, ReceptorApi;
  beforeEach(function() {
    var ReceptorMixin = require('../../../app/mixins/receptor_mixin');
    ReceptorApi = require('../../../app/api/receptor_api');
    var Klass = React.createClass({
      mixins: [ReceptorMixin],
      render() { return null; }
    });
    callbackSpy = jasmine.createSpy('callback');
    var Cursor = require('../../../app/lib/cursor');
    var $receptor = new Cursor({cells: [], desiredLrps: [], actualLrps: []}, callbackSpy);
    subject = React.render(<Klass {...{$receptor}}/>, root);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  describe('#updateReceptor', function() {
    var receptorPromise;
    beforeEach(function() {
      receptorPromise = new Deferred();
      spyOn(ReceptorApi, 'fetch').and.returnValue(receptorPromise);
    });

    describe('when cells are added', function() {
      beforeEach(function() {
        subject.updateReceptor();
        receptorPromise.resolve({
          cells: [
            Factory.build('cell', {cell_id: 3}),
            Factory.build('cell', {cell_id: 2}),
            Factory.build('cell', {cell_id: 1})
          ],
          desiredLrps: [],
          actualLrps: []
        });
      });

      it('keeps the cells in a sorted order by cell id', function() {
        expect(callbackSpy).toHaveBeenCalled();
        var cells = callbackSpy.calls.mostRecent().args[0].cells;
        expect(cells.map(c => c.cell_id)).toEqual([1, 2, 3]);
      });
    });

    describe('when an actual lrps are added', function() {
      beforeEach(function() {
        subject.updateReceptor();
        receptorPromise.resolve({
          cells: [],
          desiredLrps: [],
          actualLrps: [
            Factory.build('actualLrp', {process_guid: 'zyx', index: 10}),
            Factory.build('actualLrp', {process_guid: 'abc', index: 1}),
            Factory.build('actualLrp', {process_guid: 'zyx', index: 9})
          ]
        });
      });

      it('keeps the actual lrps in a sorted order by process guid and index', function() {
        expect(callbackSpy).toHaveBeenCalled();
        var actualLrps = callbackSpy.calls.mostRecent().args[0].actualLrps;
        expect(actualLrps.map(({process_guid, index}) => ({process_guid, index}))).toEqual([
          {process_guid: 'abc', index: 1},
          {process_guid: 'zyx', index: 9},
          {process_guid: 'zyx', index: 10}
        ]);
      });
    });
  });
});