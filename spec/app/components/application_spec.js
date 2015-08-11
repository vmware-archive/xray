require('../spec_helper');

describe('Application', function() {
  const RECEPTOR_URL = 'http://example.com';
  var Application, Cells, Page, subject;
  beforeEach(function() {
    Page = require('../../../app/components/page');
    spyOn(Page.prototype, 'render').and.callThrough();
    Cells = require('../../../app/components/cells');
    spyOn(Cells.prototype, 'render').and.callThrough();
    Application = require('../../../app/components/application');
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  describe('when a receptor url is provided in configuration', function() {
    var CellsApi, ReceptorApi, actualLrps, cells, desiredLrps;
    const now = 10000000000;

    beforeEach(function() {
      spyOn(Date, 'now').and.returnValue(now);
      var props = {config: {receptorUrl: RECEPTOR_URL, colors: ['#fff', '#000']}};
      cells = Factory.buildList('cell', 2);
      desiredLrps = Factory.buildList('desiredLrp', 3);
      actualLrps = [
        Factory.build('actualLrp', {cell_id: cells[0].cell_id}),
        Factory.build('actualLrp', {cell_id: cells[1].cell_id})
      ];

      ReceptorApi = require('../../../app/api/receptor_api');
      CellsApi = require('../../../app/api/cells_api');
      spyOn(CellsApi, 'fetch').and.callThrough();
      var receptorPromise = new Deferred();
      spyOn(ReceptorApi, 'fetch').and.returnValue(receptorPromise);
      subject = React.render(<Application {...props}/>, root);
      receptorPromise.resolve({actualLrps, cells, desiredLrps});
    });

    it('renders cells', function() {
      expect(Cells.prototype.render).toHaveBeenCalled();
    });

    it('sets the cells', function() {
      expect(subject.state.receptor.cells).toEqual(cells);
    });

    it('has receptor history with 1 entry', function() {
      expect(Object.keys(subject.state.receptorHistory)).toHaveLength(1);
      expect(subject.state.receptorHistory[now]).toEqual(subject.state.receptor);
    });

    describe('#pollReceptor', function() {
      describe('when the cell poll interval time has passed', function() {
        beforeEach(function() {
          ReceptorApi.fetch.calls.reset();
          jasmine.clock().tick(require('../../../app/components/page').CELL_POLL_INTERVAL);
        });

        it('fetches the receptor', function() {
          expect(CellsApi.fetch).toHaveBeenCalled();
        });
      });

      describe('when the receptor poll interval time has passed', function() {
        beforeEach(function() {
          ReceptorApi.fetch.calls.reset();
          jasmine.clock().tick(require('../../../app/components/page').RECEPTOR_POLL_INTERVAL);
        });

        it('fetches the receptor', function() {
          expect(ReceptorApi.fetch).toHaveBeenCalled();
        });
      });
    });

    describe('#updateReceptor', function() {
      var oldCells, oldState, oldActualLrps, oldDesiredLrps, newReceptorPromise;

      beforeEach(function() {
        oldCells = [
          Factory.build('cell', {cell_id: 'immutable'}),
          Factory.build('cell', {cell_id: 'mutable'}),
          Factory.build('cell', {cell_id: 'removable'})
        ];

        oldActualLrps = [
          Factory.build('actualLrp', {cell_id: 'immutable', instance_guid: '1', modification_tag: {epoch: '1', index: 0}}),
          Factory.build('actualLrp', {cell_id: 'mutable', instance_guid: '2', modification_tag: {epoch: '2', index: 0}}),
          Factory.build('actualLrp', {cell_id: 'mutable', instance_guid: '3', modification_tag: {epoch: '3', index: 0}}),
          Factory.build('actualLrp', {cell_id: 'mutable', instance_guid: '-1', modification_tag: {epoch: '-1', index: 0}})
        ];

        oldDesiredLrps = [
          Factory.build('desiredLrp', {process_guid: 'desirable'}),
          Factory.build('desiredLrp', {process_guid: 'undesirable'})
        ];

        subject.setState({receptor: {cells: oldCells, actualLrps: oldActualLrps, desiredLrps: oldDesiredLrps, desiredLrpsByProcessGuid: {}, actualLrpsByProcessGuid: {}, actualLrpsByCellId: {}}});
        newReceptorPromise = new Deferred();
        ReceptorApi.fetch.and.returnValue(newReceptorPromise);
        oldState = Object.assign({}, subject.state);
        subject.refs.page.updateReceptor();
      });

      describe('when cells change', function() {
        var newCells;
        const now = 10000001000;
        beforeEach(function() {
          Date.now.and.returnValue(now);
          newCells = [
            Object.assign({}, oldCells[0]),
            Object.assign({}, oldCells[1], {foo: 'bar'}),
            Factory.build('cell', {cell_id: 'new'})
          ];
          newReceptorPromise.resolve({cells: newCells, desiredLrps: oldDesiredLrps, actualLrps: oldActualLrps});
        });

        it('adds and removes the cells', function() {
          var cellIds = subject.state.receptor.cells.map(({cell_id}) => cell_id);
          expect(cellIds).not.toContain('removable');
          expect(cellIds).toContain('new');
        });

        it('keeps unchanged cells the same in memory', function() {
          expect(subject.state.receptor.cells[0]).toBe(oldState.receptor.cells[0]);
        });

        it('has receptor history with 2 entries', function() {
          expect(Object.keys(subject.state.receptorHistory)).toHaveLength(2);
          expect(subject.state.receptorHistory[now]).toEqual(subject.state.receptor);
        });

        describe('when the current time changes', function() {
          describe('when the current time is not "now"', function() {
            describe('when the time is in the history', function() {
              var selectedReceptor;
              beforeEach(function() {
                subject.setState({currentTime: now});
                expect(Page.prototype.render).toHaveBeenCalled();
                selectedReceptor = Page.prototype.render.calls.mostRecent().object.props.selectedReceptor;
              });

              it('passes to the page the selected receptor', function() {
                expect(selectedReceptor).toEqual(subject.state.receptorHistory[now]);
              });
            });

            describe('when the time is not in the history', function() {
              var selectedReceptor;
              beforeEach(function() {
                subject.setState({slider: {currentTime: now + 100, beginningOfTime: now - 100}});
                expect(Page.prototype.render).toHaveBeenCalled();
                selectedReceptor = Page.prototype.render.calls.mostRecent().object.props.selectedReceptor;
              });

              it('passes to the page the receptor nearest to that time in the past', function() {
                expect(selectedReceptor).toEqual(subject.state.receptorHistory[now]);
              });
            });
          });

          describe('when the current time is "now"', function() {
            var selectedReceptor;
            beforeEach(function() {
              subject.setState({slider: {currentTime: 'now', beginningOfTime: now - 100}});
              expect(Page.prototype.render).toHaveBeenCalled();
              selectedReceptor = Page.prototype.render.calls.mostRecent().object.props.selectedReceptor;
            });

            it('passes the selected receptor to the page', function() {
              expect(selectedReceptor).toEqual(subject.state.receptor);
            });
          });
        });
      });

      describe('when actual lrps change', function() {
        var newActualLrps;
        beforeEach(function() {
          newActualLrps = [
            Object.assign({}, oldActualLrps[0]),
            Object.assign({}, oldActualLrps[1]),
            Object.assign({}, oldActualLrps[2], {modification_tag: {epoch: '3', index: 10}}),
            Factory.build('actualLrp', {cell_id: 'mutable', since: 1, instance_guid: '4'}),
            Factory.build('actualLrp', {cell_id: 'new', since: 1, instance_guid: '5'})
          ];
          newReceptorPromise.resolve({cells: oldCells, desiredLrps: oldDesiredLrps, actualLrps: newActualLrps});
        });

        it('adds and removes lrps', function() {
          var instanceGuids = subject.state.receptor.actualLrps.map(({instance_guid}) => instance_guid);
          expect(instanceGuids).not.toContain('-1');
          expect(instanceGuids).toContain('4');
          expect(instanceGuids).toContain('5');
        });

        it('keeps unchanged cells the same in memory', function() {
          expect(subject.state.receptor.actualLrps[0]).toBe(oldState.receptor.actualLrps[0]);
          expect(subject.state.receptor.actualLrps[1]).toBe(oldState.receptor.actualLrps[1]);
        });

        it('updates changed actualLrps', function() {
          expect(subject.state.receptor.actualLrps[2]).not.toBe(oldState.receptor.actualLrps[2]);
        });
      });

      describe('when desired lrps change', function() {
        var newDesiredLrps;
        beforeEach(function() {
          newDesiredLrps = [
            Object.assign({}, oldDesiredLrps[0]),
            Factory.build('desiredLrp', {process_guid: 'new'})
          ];
          newReceptorPromise.resolve({cells: oldCells, desiredLrps: newDesiredLrps, actualLrps: oldActualLrps});
        });

        it('adds and removes lrps', function() {
          var processGuids = subject.state.receptor.desiredLrps.map(({process_guid}) => process_guid);
          expect(processGuids).not.toContain('undesirable');
          expect(processGuids).toContain('desirable');
          expect(processGuids).toContain('new');
        });

        it('keeps unchanged cells the same in memory', function() {
          expect(subject.state.receptor.desiredLrps[0]).toBe(oldState.receptor.desiredLrps[0]);
        });

        it('updates changed desiredLrps', function() {
          expect(subject.state.receptor.desiredLrps[1]).not.toBe(oldState.receptor.desiredLrps[1]);
        });
      });

    });

    describe('clicking the refresh button', function() {
      beforeEach(function() {
        ReceptorApi.fetch.calls.reset();
        $('.fa-undo').simulate('click');
      });

      it('refreshes the receptor', function() {
        expect(ReceptorApi.fetch).toHaveBeenCalled();
      });
    });

    describe('when clicking on the edit receptor button', function() {
      beforeEach(function() {
        $('.main-header button').simulate('click');
      });

      it('renders the launch modal', function() {
        expect('.launch-modal').toExist();
      });
    });
  });
});
