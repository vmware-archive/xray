require('../spec_helper');

describe('CellsApi', function() {
  const RECEPTOR_URL = 'http://example.com';
  var subject;
  beforeEach(function() {
    require('../../../app/api/base_api').baseUrl = RECEPTOR_URL;
    subject = require('../../../app/api/cells_api');
  });

  describe('#fetch', function() {
    var doneSpy, cellsRequest;
    beforeEach(function() {
      doneSpy = jasmine.createSpy('done');
      subject.fetch().then(doneSpy);
      cellsRequest = jasmine.Ajax.requests.filter(`${RECEPTOR_URL}/v1/cells`)[0];
    });

    it('makes an ajax request for cells', function() {
      expect(cellsRequest).toBeDefined();
    });

    describe('when the ajax request is successful', function() {
      var cells;
      beforeEach(function() {
        cells = Factory.buildList('cell', 2);
        cellsRequest.respondWith({
          status: 200,
          responseText: JSON.stringify(cells)
        });
        MockPromises.executeForResolvedPromises();
        MockPromises.executeForResolvedPromises();
      });

      it('resolves the promise with the cells', function() {
        expect(doneSpy).toHaveBeenCalledWith({cells});
      });
    });
  });
});