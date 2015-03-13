require('../spec_helper');

describe('Application', function() {
  const RECEPTOR_URL = 'http://example.com';
  var Application, Cells, subject, request;
  beforeEach(function() {
    Cells = require('../../../app/components/cells');
    spyOn(Cells.type.prototype, 'render').and.callThrough();
    Application = require('../../../app/components/application');
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  describe('when a receptor url is provided in configuration', function() {
    var CellsApi, ReceptorApi, actualLrps, cells, desiredLrps;

    beforeEach(function() {
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
      expect(Cells.type.prototype.render).toHaveBeenCalled();
    });

    it('sets the cells', function() {
      expect(subject.state.receptor.cells).toEqual(cells);
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
          Factory.build('actualLrp', {cell_id: 'immutable', since: 1, instance_guid: '1'}),
          Factory.build('actualLrp', {cell_id: 'mutable', since: 1, instance_guid: '2'}),
          Factory.build('actualLrp', {cell_id: 'mutable', since: 1, instance_guid: '3'}),
          Factory.build('actualLrp', {cell_id: 'mutable', since: 1, instance_guid: '-1'})
        ];

        oldDesiredLrps = [
          Factory.build('desiredLrp', {process_guid: 'desirable'}),
          Factory.build('desiredLrp', {process_guid: 'undesirable'})
        ];

        subject.setState({receptor: {cells: oldCells, actualLrps: oldActualLrps, desiredLrps: oldDesiredLrps}});
        newReceptorPromise = new Deferred();
        ReceptorApi.fetch.and.returnValue(newReceptorPromise);
        oldState = Object.assign({}, subject.state);
        subject.refs.page.updateReceptor();
      });

      describe('when cells change', function() {
        var newCells;
        beforeEach(function() {
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
      });

      describe('when actual lrps change', function() {
        var newActualLrps;
        beforeEach(function() {
          newActualLrps = [
            Object.assign({}, oldActualLrps[0]),
            Object.assign({}, oldActualLrps[1]),
            Object.assign({}, oldActualLrps[2], {since: 10}),
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
        $('.refresh').simulate('click');
      });

      it('refreshes the receptor', function() {
        expect(ReceptorApi.fetch).toHaveBeenCalled();
      });
    });
  });

  describe('when no receptor url is provided in configuration', function() {
    var Modal;
    beforeEach(function() {
      Modal = require('../../../app/components/modal');
      jasmineReact.spyOnClass(Modal, 'open').and.callThrough();
      var props = {config: {colors: ['#fff', '#000']}};
      subject = React.render(<Application {...props}/>, root);
      request = jasmine.Ajax.requests.mostRecent();
    });

    it('launches a modal asking for the url', function() {
      var {type} = require('../../../app/components/receptor_url_modal');
      expect(Modal.type.prototype.open).toHaveBeenCalledWith(jasmine.objectContaining({type}));
    });

    describe('when the user submits a receptor url', function() {
      const NEW_RECEPTOR_URL = 'http://foo.com';
      beforeEach(function() {
        $('.receptor-url-modal :text').val(NEW_RECEPTOR_URL).simulate('change');
        $('form.receptor-url-modal').simulate('submit');
        request = jasmine.Ajax.requests.mostRecent();
      });

      it('sends the receptor url to the server (cookie requested)', function() {
        expect('receptor_url').toHaveBeenRequested();
        expect(JSON.parse(request.params)).toEqual({receptor_url: NEW_RECEPTOR_URL});
      });

      describe('after the cookie thing', function() {
        beforeEach(function() {
          request.respondWith({
            status: 200,
            responseText: ''
          });
          MockPromises.executeForResolvedPromises();
        });

        it('makes ajax requests for the cells', function() {
          expect(`${NEW_RECEPTOR_URL}/v1/cells`).toHaveBeenRequested();
          expect(`${NEW_RECEPTOR_URL}/v1/actual_lrps`).toHaveBeenRequested();
        });

        it('makes ajax requests for the desired lrps', function() {
          expect(`${NEW_RECEPTOR_URL}/v1/desired_lrps`).toHaveBeenRequested();
        });
      });
    });
  });
});
