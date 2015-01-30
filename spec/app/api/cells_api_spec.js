require('../spec_helper');

describe('CellsApi', function() {
  const RECEPTOR_URL = 'http://example.com';
  var subject;
  beforeEach(function() {
    subject = require('../../../app/api/cells_api');
    subject.baseUrl = RECEPTOR_URL;
  });

  describe('#fetch', function() {
    var request, doneSpy;
    beforeEach(function() {
      doneSpy = jasmine.createSpy('done');
      subject.fetch().then(doneSpy);
      request = jasmine.Ajax.requests.mostRecent();
    });

    it('makes an ajax request', function() {
      expect(request).toBeDefined();
      expect(request.url).toEqual(`${RECEPTOR_URL}/v1/cells`);
    });

    describe('when the ajax request is successful', function() {
      var cells;
      beforeEach(function() {
        cells = Factory.buildList('cell', 2);
        request.respondWith({
          status: 200,
          responseText: JSON.stringify(cells)
        });
        mockPromises.contracts.mostRecent().execute();
      });

      it('resolves the promise with the cells', function() {
        expect(doneSpy).toHaveBeenCalledWith({cells});
      });
    });
  });
});