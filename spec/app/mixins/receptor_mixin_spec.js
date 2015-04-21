require('../spec_helper');

describe('ReceptorMixin', function() {
  var subject, callbackSpy, ReceptorApi, desiredLrp, actualLrp;
  beforeEach(function() {
    var ReceptorMixin = require('../../../app/mixins/receptor_mixin');
    ReceptorApi = require('../../../app/api/receptor_api');
    var Klass = React.createClass({
      mixins: [ReceptorMixin],
      render() { return null; }
    });
    callbackSpy = jasmine.createSpy('callback');
    var Cursor = require('pui-cursor');
    desiredLrp = Factory.build('desiredLrp', {process_guid: 'two', modification_tag: {epoch: 'epoch', index: 0}}, {raw: true});
    actualLrp = Factory.build('actualLrp', {cell_id: 'foo', process_guid: 'two', modification_tag: {epoch: 'epoch', index: 0}});
    var $receptor = new Cursor({
      cells: [],
      desiredLrps: [desiredLrp],
      actualLrps: [actualLrp],
      desiredLrpsByProcessGuid: {two: desiredLrp},
      actualLrpsByProcessGuid: {two: [actualLrp]},
      actualLrpsByCellId: {foo: [actualLrp]}},
      callbackSpy);
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

    describe('when desired lrps are added', function() {
      var desiredLrps;
      beforeEach(function() {
        subject.updateReceptor();
        var routes = {'cf-router': [{hostnames: ['host1', 'host2'], port: 8080}]};
        desiredLrps = [
          Factory.build('desiredLrp', {process_guid: 'one', routes: routes, filterString: null}),
          Object.assign({}, desiredLrp),
          Factory.build('desiredLrp', {process_guid: 'three'})
        ];
        receptorPromise.resolve({
          cells: [],
          desiredLrps: desiredLrps,
          actualLrps: []
        });
        expect(callbackSpy).toHaveBeenCalled();
      });

      it('updates the desired lrps', function() {
        var desiredLrps = callbackSpy.calls.mostRecent().args[0].desiredLrps;
        expect(desiredLrps.map(c => c.process_guid)).toEqual(['two', 'one', 'three']);
      });

      it('adds the filterString to the desired lrps', function() {
        var desiredLrp = callbackSpy.calls.mostRecent().args[0].desiredLrps[1];
        expect(desiredLrp.filterString).toContain('one');
        expect(desiredLrp.filterString).toContain('host1');
        expect(desiredLrp.filterString).toContain('host2');
      });

      it('updates the desiredLrpsByProcessGuid', function() {
        var desiredLrpsByProcessGuid = callbackSpy.calls.mostRecent().args[0].desiredLrpsByProcessGuid;
        expect(desiredLrpsByProcessGuid.one).toBe(desiredLrps[0]);
        expect(desiredLrpsByProcessGuid.two).toBe(desiredLrp);
        expect(desiredLrpsByProcessGuid.three).toBe(desiredLrps[2]);
      });

      it('updates the actualLrpsByProcessGuid', function() {
        var desiredLrpsByProcessGuid = callbackSpy.calls.mostRecent().args[0].desiredLrpsByProcessGuid;
        expect(desiredLrpsByProcessGuid.one).toBe(desiredLrps[0]);
        expect(desiredLrpsByProcessGuid.two).toBe(desiredLrp);
        expect(desiredLrpsByProcessGuid.three).toBe(desiredLrps[2]);
      });
    });

    describe('when lrps are changed', function() {
      var changedDesiredLrp, changedActualLrp, newActualLrp1, newActualLrp2;
      beforeEach(function() {
        subject.updateReceptor();
        changedDesiredLrp = Object.assign({}, desiredLrp, {instances: 55, modification_tag: {epoch: 'epoch', index: 1}});
        changedActualLrp = Object.assign({}, actualLrp, {modification_tag: {epoch: 'epoch', index: 1}});
        newActualLrp1 = Factory.build('actualLrp', {cell_id: 'foo', process_guid: 'one'});
        newActualLrp2 = Factory.build('actualLrp', {cell_id: 'bar', process_guid: 'two'});
        receptorPromise.resolve({
          cells: [],
          desiredLrps: [changedDesiredLrp],
          actualLrps: [changedActualLrp, newActualLrp1, newActualLrp2]
        });
        expect(callbackSpy).toHaveBeenCalled();
      });

      it('updates the desired lrps', function() {
        var desiredLrp = callbackSpy.calls.mostRecent().args[0].desiredLrps[0];
        expect(desiredLrp).toEqual(jasmine.objectContaining(changedDesiredLrp));
      });

      it('retains decorations on the desired lrps', function() {
        var desiredLrp = callbackSpy.calls.mostRecent().args[0].desiredLrps[0];
        expect(desiredLrp.filterString).toContain('two');
      });

      it('updates the desiredLrpsByProcessGuid', function() {
        var desiredLrpsByProcessGuid = callbackSpy.calls.mostRecent().args[0].desiredLrpsByProcessGuid;
        expect(desiredLrpsByProcessGuid.two).toEqual(jasmine.objectContaining(changedDesiredLrp));
      });

      it('updates the actualLrpsByProcessGuid', function() {
        var actualLrpsByProcessGuid = callbackSpy.calls.mostRecent().args[0].actualLrpsByProcessGuid;
        expect(actualLrpsByProcessGuid).toEqual({
          one: [newActualLrp1],
          two: [changedActualLrp, newActualLrp2]
        });
      });

      it('updates the actualLrpsByCellId', function() {
        var actualLrpsByCellId = callbackSpy.calls.mostRecent().args[0].actualLrpsByCellId;
        expect(actualLrpsByCellId).toEqual({
          foo: [newActualLrp1, changedActualLrp],
          bar: [newActualLrp2]
        });
      });
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
        expect(callbackSpy).toHaveBeenCalled();
      });

      it('keeps the cells in a sorted order by cell id', function() {
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
        expect(callbackSpy).toHaveBeenCalled();
      });

      it('keeps the actual lrps in a sorted order by process guid and index', function() {
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