require('../spec_helper');

describe('CellsApi', function() {
  const RECEPTOR_URL = 'http://example.com';
  var subject;
  beforeEach(function() {
    require('../../../app/api/receptor_api').baseUrl = RECEPTOR_URL;
    subject = require('../../../app/api/cells_api');
  });

  describe('#fetch', function() {
    var doneSpy, cellsRequest, lrpsRequest;
    beforeEach(function() {
      doneSpy = jasmine.createSpy('done');
      subject.fetch().then(doneSpy);
      cellsRequest = jasmine.Ajax.requests.filter(`${RECEPTOR_URL}/v1/cells`)[0];
      lrpsRequest = jasmine.Ajax.requests.filter(`${RECEPTOR_URL}/v1/actual_lrps`)[0];
    });

    it('makes an ajax request for cells', function() {
      expect(cellsRequest).toBeDefined();
    });

    it('makes an ajax request for actual_lrps', function() {
      expect(lrpsRequest).toBeDefined();
    });

    describe('when the ajax requests are successful', function() {
      var cells, actualLrps;
      beforeEach(function() {
        cells = Factory.buildList('cell', 2);
        actualLrps = Factory.buildList('actualLrp', 3);
        actualLrps[0].cell_id = cells[0].cell_id;
        actualLrps[1].cell_id = cells[1].cell_id;
        actualLrps[2].cell_id = cells[1].cell_id;
        cellsRequest.respondWith({
          status: 200,
          responseText: JSON.stringify(cells)
        });
        lrpsRequest.respondWith({
          stats: 200,
          responseText: JSON.stringify(actualLrps)
        });
        mockPromises.executeForResolvedPromises();
        mockPromises.executeForResolvedPromises();
        mockPromises.executeForResolvedPromises();
      });

      it('resolves the promise with the cells and actualLrps', function() {
        var cell1 = Object.assign(cells[0], {actual_lrps: [actualLrps[0]]});
        var cell2 = Object.assign(cells[1], {actual_lrps: [actualLrps[1], actualLrps[2]]});
        expect(doneSpy).toHaveBeenCalledWith({cells: [cell1, cell2]});
      });
    });
  });
});