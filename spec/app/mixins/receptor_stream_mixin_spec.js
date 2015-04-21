require('../spec_helper');

describe('ReceptorStreamMixin', function() {
  const receptorUrl = 'http://example.com';
  var Cursor, subject, callbackSpy, desiredLrp, actualLrp, actualLrp2;

  beforeEach(function() {
    var ReceptorStreamMixin = require('../../../app/mixins/receptor_stream_mixin');
    var Klass = React.createClass({
      mixins: [ReceptorStreamMixin],
      render() {
        return null;
      }
    });
    callbackSpy = jasmine.createSpy('callback');
    Cursor = require('pui-cursor');
    actualLrp = Factory.build('actualLrp', {cell_id: 'android17', process_guid: 'xyz', index: 1, modification_tag: {epoch: 1, index: 1}});
    actualLrp2 = Factory.build('actualLrp', {cell_id: 'android17', process_guid: 'xyz', index: 2});
    desiredLrp = Factory.build('desiredLrp', {process_guid: 'xyz'});
    var desiredLrpsByProcessGuid = {
      xyz: desiredLrp
    };
    var actualLrpsByProcessGuid = {
      xyz: [actualLrp, actualLrp2]
    };
    var actualLrpsByCellId = {
      android17: [actualLrp, actualLrp2]
    };
    var $receptor = new Cursor({
      cells: [],
      desiredLrps: [desiredLrp],
      actualLrps: [actualLrp],
      desiredLrpsByProcessGuid,
      actualLrpsByProcessGuid,
      actualLrpsByCellId}, callbackSpy);
    subject = React.render(<Klass {...{$receptor}}/>, root);
    subject.createSSE(receptorUrl);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  describe('#streamActualLrps', function() {
    beforeEach(function() {
      subject.streamActualLrps();
    });

    describe('when actual_lrp created events are received', function() {
      var newActualLrp;
      beforeEach(function() {
        newActualLrp = Factory.build('actualLrp', {cell_id: 'android18', process_guid: 'abc', index: 1});
        MockEventSource.mostRecent().trigger('actual_lrp_created', {
          actual_lrp: newActualLrp
        });
      });

      it('adds the actual lrp to the receptor', function() {
        expect(callbackSpy).toHaveBeenCalled();
        var actualLrps = callbackSpy.calls.mostRecent().args[0].actualLrps;
        expect(actualLrps.map(({process_guid, index}) => ({process_guid, index}))).toEqual([
          {process_guid: 'abc', index: 1},
          {process_guid: 'xyz', index: 1}
        ]);
      });

      it('adds the actual lrp to the process_guid index', function() {
        var {actualLrpsByProcessGuid} = callbackSpy.calls.mostRecent().args[0];
        expect(actualLrpsByProcessGuid).toEqual({
          abc: [newActualLrp],
          xyz: [actualLrp, actualLrp2]
        });
      });

      it('adds the actual lrp to the cell id index', function() {
        var {actualLrpsByCellId} = callbackSpy.calls.mostRecent().args[0];
        expect(actualLrpsByCellId).toEqual({
          android17: [actualLrp, actualLrp2],
          android18: [newActualLrp]
        });
      });
    });

    describe('when actual lrp removed events are received', function() {
      describe('when the index for the changed lrp exists', function() {
        beforeEach(function() {
          MockEventSource.mostRecent().trigger('actual_lrp_removed', {
            actual_lrp: actualLrp
          });
          expect(callbackSpy).toHaveBeenCalled();
        });

        it('removes the desired lrp from the receptor', function() {
          var actualLrps = callbackSpy.calls.mostRecent().args[0].actualLrps;
          expect(actualLrps).not.toContain(actualLrp);
        });

        it('removes the actual lrp from the process guid index', function() {
          var {actualLrpsByProcessGuid} = callbackSpy.calls.mostRecent().args[0];
          expect(actualLrpsByProcessGuid).toEqual({xyz: [actualLrp2]});
        });

        it('removes the desired lrp from the cell id index', function() {
          var {actualLrpsByCellId} = callbackSpy.calls.mostRecent().args[0];
          expect(actualLrpsByCellId).toEqual({android17: [actualLrp2]});
        });
      });

      describe('when the index for the changed lrp does not exist', function() {
        it('does not throw an exception', function() {
          var $receptor = new Cursor({
            cells: [],
            desiredLrps: [],
            actualLrps: [actualLrp],
            desiredLrpsByProcessGuid: {},
            actualLrpsByProcessGuid: {},
            actualLrpsByCellId: {}}, callbackSpy);
          subject.setProps({$receptor});

          expect(function() {
            MockEventSource.mostRecent().trigger('actual_lrp_removed', {
              actual_lrp: actualLrp
            });
          }).not.toThrow();
        });

        it('removes the old actual lrp from its old index', function() {
          var $receptor = new Cursor({
            cells: [],
            desiredLrps: [],
            actualLrps: [actualLrp],
            desiredLrpsByProcessGuid: {},
            actualLrpsByProcessGuid: {},
            actualLrpsByCellId: {[actualLrp.cell_id]: [actualLrp]}}, callbackSpy);
          subject.setProps({$receptor});

          MockEventSource.mostRecent().trigger('actual_lrp_removed', {
            actual_lrp: Object.assign({}, actualLrp, {cell_id: 'new_cell_id'})
          });
          expect(callbackSpy).toHaveBeenCalled();
          var {actualLrpsByCellId} = callbackSpy.calls.mostRecent().args[0];
          expect(actualLrpsByCellId).toEqual({
            android17: []
          });
        });
      });
    });

    describe('when an actual_lrp change event is received', function() {
      var changedActualLrp;
      beforeEach(function() {
        changedActualLrp = Factory.build('actualLrp', {cell_id: 'android17', process_guid: 'xyz', index: 1, modification_tag: {epoch: 1, index: 2}});
      });

      describe('when the index for the changed lrp exists', function() {
        beforeEach(function() {
          MockEventSource.mostRecent().trigger('actual_lrp_changed', {
            actual_lrp_before: actualLrp,
            actual_lrp_after: changedActualLrp
          });
        });

        it('changes the actual lrp to the receptor', function() {
          expect(callbackSpy).toHaveBeenCalled();
          var actualLrps = callbackSpy.calls.mostRecent().args[0].actualLrps;
          expect(actualLrps).toEqual([changedActualLrp]);
        });

        it('changes the actual lrp from the process guid index', function() {
          var actualLrpsByProcessGuid = callbackSpy.calls.mostRecent().args[0].actualLrpsByProcessGuid;
          expect(actualLrpsByProcessGuid).toEqual({xyz: [changedActualLrp, actualLrp2]});
        });

        it('changes the actual lrp from the cell id index', function() {
          var {actualLrpsByCellId} = callbackSpy.calls.mostRecent().args[0];
          expect(actualLrpsByCellId).toEqual({android17: [changedActualLrp, actualLrp2]});
        });
      });

      describe('when the index for the changed lrp does not exist', function() {
        it('does not throw an exception', function() {
          var $receptor = new Cursor({
            cells: [],
            desiredLrps: [],
            actualLrps: [actualLrp],
            desiredLrpsByProcessGuid: {},
            actualLrpsByProcessGuid: {},
            actualLrpsByCellId: {}}, callbackSpy);
          subject.setProps({$receptor});

          expect(function() {
            MockEventSource.mostRecent().trigger('actual_lrp_changed', {
              actual_lrp_before: actualLrp,
              actual_lrp_after: changedActualLrp
            });
          }).not.toThrow();
        });

        it('removes the old actual lrp from its old index', function() {
          var $receptor = new Cursor({
            cells: [],
            desiredLrps: [],
            actualLrps: [changedActualLrp],
            desiredLrpsByProcessGuid: {},
            actualLrpsByProcessGuid: {},
            actualLrpsByCellId: {[changedActualLrp.cell_id]: [changedActualLrp]}}, callbackSpy);
          subject.setProps({$receptor});

          var actualLrpAfter = Object.assign({}, changedActualLrp, {cell_id: 'new_cell_id'});
          MockEventSource.mostRecent().trigger('actual_lrp_changed', {
            actual_lrp_before: actualLrp,
            actual_lrp_after: actualLrpAfter
          });
          expect(callbackSpy).toHaveBeenCalled();
          var {actualLrpsByCellId} = callbackSpy.calls.mostRecent().args[0];
          expect(actualLrpsByCellId).toEqual({
            android17: [],
            new_cell_id: [actualLrpAfter]
          });
        });
      });
    });
  });

  describe('#streamDesiredLrps', function() {
    beforeEach(function() {
      subject.streamDesiredLrps();
    });
    describe('when desired_lrp created events are received', function() {
      var newDesiredLrp;
      beforeEach(function() {
        var routes = {'cf-router': [{hostnames: ['host1', 'host2'], port: 8080}]};
        newDesiredLrp = Factory.build('desiredLrp', {process_guid: 'abc', routes}, {raw: true});
        MockEventSource.mostRecent().trigger('desired_lrp_created', {
          desired_lrp: newDesiredLrp
        });
        expect(callbackSpy).toHaveBeenCalled();
      });

      it('adds the desired lrp to the receptor', function() {
        var desiredLrps = callbackSpy.calls.mostRecent().args[0].desiredLrps;
        expect(desiredLrps).toContain(jasmine.objectContaining(newDesiredLrp));
      });

      it('adds the filterString to the desiredLrp', function() {
        var desiredLrp = callbackSpy.calls.mostRecent().args[0].desiredLrps[1];
        expect(desiredLrp.filterString).toContain('abc');
        expect(desiredLrp.filterString).toContain('host1');
        expect(desiredLrp.filterString).toContain('host2');
      });

      it('adds the desired lrp to the index', function() {
        var desiredLrpsByProcessGuid = callbackSpy.calls.mostRecent().args[0].desiredLrpsByProcessGuid;
        expect(desiredLrpsByProcessGuid.abc).toEqual(jasmine.objectContaining(newDesiredLrp));
      });
    });

    describe('when desired lrp removed events are received', function() {
      beforeEach(function() {
        MockEventSource.mostRecent().trigger('desired_lrp_removed', {
          desired_lrp: desiredLrp
        });
        expect(callbackSpy).toHaveBeenCalled();
      });

      it('removes the desired lrp from the receptor', function() {
        var desiredLrps = callbackSpy.calls.mostRecent().args[0].desiredLrps;
        expect(desiredLrps).not.toContain(desiredLrp);
      });

      it('removes the desired lrp from the index', function() {
        var desiredLrpsByProcessGuid = callbackSpy.calls.mostRecent().args[0].desiredLrpsByProcessGuid;
        expect(desiredLrpsByProcessGuid.xyz).toBeUndefined();
      });
    });

    describe('when desired lrp change events is received', function() {
      describe('when the desiredLrp does exist', function() {
        var changedDesiredLrp;
        beforeEach(function() {
          changedDesiredLrp = Object.assign({foo: 'bar'}, desiredLrp);
          delete changedDesiredLrp.filterString;
          MockEventSource.mostRecent().trigger('desired_lrp_changed', {
            desired_lrp_after: changedDesiredLrp
          });
          expect(callbackSpy).toHaveBeenCalled();
        });

        it('updates the desiredLrp on the receptor', function() {
          var desiredLrps = callbackSpy.calls.mostRecent().args[0].desiredLrps;
          expect(desiredLrps).toContain(jasmine.objectContaining(changedDesiredLrp));
        });

        it('updates the desiredLrp on the index', function() {
          var desiredLrpsByProcessGuid = callbackSpy.calls.mostRecent().args[0].desiredLrpsByProcessGuid;
          expect(desiredLrpsByProcessGuid[changedDesiredLrp.process_guid]).toEqual(jasmine.objectContaining(changedDesiredLrp));
        });

        it('still has decorations', function() {
          var desiredLrp = callbackSpy.calls.mostRecent().args[0].desiredLrps[0];
          expect(desiredLrp.filterString).toContain(changedDesiredLrp.process_guid);
        });
      });

      describe('when the desiredLrp does not exist yet', function() {
        var newDesiredLrp;
        beforeEach(function() {
          newDesiredLrp = Factory.build('desiredLrp', {}, {raw: true});
          MockEventSource.mostRecent().trigger('desired_lrp_changed', {
            desired_lrp_after: newDesiredLrp
          });
          expect(callbackSpy).toHaveBeenCalled();
        });

        it('adds the desired lrp to the receptor', function() {
          var desiredLrps = callbackSpy.calls.mostRecent().args[0].desiredLrps;
          expect(desiredLrps).toContain(jasmine.objectContaining(newDesiredLrp));
        });

        it('adds the desired lrp to the index', function() {
          var desiredLrpsByProcessGuid = callbackSpy.calls.mostRecent().args[0].desiredLrpsByProcessGuid;
          expect(desiredLrpsByProcessGuid[newDesiredLrp.process_guid]).toEqual(jasmine.objectContaining(newDesiredLrp));
        });
      });
    });
  });
});